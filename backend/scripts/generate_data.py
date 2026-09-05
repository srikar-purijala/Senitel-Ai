import uuid
import random
import logging
from datetime import datetime, timedelta
from faker import Faker
from sqlalchemy.orm import Session

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.db.session import SessionLocal, engine
from app.db.base_class import Base
from app.models.entities import Entity
from app.models.transactions import Transaction
from app.models.relationships import Edge
from app.models.networks import Network, NetworkEntity

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

fake = Faker()
START_DATE = datetime.now() - timedelta(days=30)

def create_entity(db: Session, entity_type: str, entity_value: str = None) -> Entity:
    if not entity_value:
        if entity_type == "CUSTOMER":
            entity_value = fake.name()
        elif entity_type == "DEVICE":
            entity_value = f"DEV-{fake.uuid4()[:8]}"
        elif entity_type == "IP":
            entity_value = fake.ipv4()
        elif entity_type == "ADDRESS":
            entity_value = fake.address().replace("\n", ", ")
        elif entity_type == "PAYMENT_INSTRUMENT":
            entity_value = fake.credit_card_number()
        elif entity_type == "MERCHANT":
            entity_value = fake.company()
        else:
            entity_value = fake.pystr()

    ent = Entity(
        id=str(uuid.uuid4()),
        entity_type=entity_type,
        entity_value=entity_value,
        first_seen=START_DATE + timedelta(days=random.randint(0, 5)),
        last_seen=datetime.now(),
        is_synthetic="true"
    )
    db.add(ent)
    return ent

def create_edge(db: Session, source: Entity, target: Entity, rel_type: str, ts: datetime = None):
    edge = Edge(
        id=str(uuid.uuid4()),
        source_entity_id=source.id,
        target_entity_id=target.id,
        relationship_type=rel_type,
        timestamp=ts or datetime.now()
    )
    db.add(edge)
    return edge

def create_transaction(db: Session, customer: Entity, merchant: Entity, pi: Entity, dev: Entity, ip: Entity, amount: float, ts: datetime, is_abuse: bool = False, network_id: str = None):
    txn = Transaction(
        id=str(uuid.uuid4()),
        customer_id=customer.id,
        merchant_id=merchant.id,
        payment_instrument_id=pi.id,
        device_id=dev.id,
        ip_id=ip.id,
        amount=amount,
        timestamp=ts,
        is_abuse=is_abuse,
        network_id=network_id
    )
    db.add(txn)
    # Also create graph edges mapping this transaction conceptually
    create_edge(db, customer, dev, "USES", ts)
    create_edge(db, customer, ip, "CONNECTS_FROM", ts)
    create_edge(db, customer, pi, "PAYS_WITH", ts)
    return txn

def generate_normal_behavior(db: Session, num_customers=100):
    logger.info(f"Generating {num_customers} normal customers...")
    merchants = [create_entity(db, "MERCHANT") for _ in range(5)]
    
    for _ in range(num_customers):
        cust = create_entity(db, "CUSTOMER")
        dev = create_entity(db, "DEVICE")
        ip = create_entity(db, "IP")
        addr = create_entity(db, "ADDRESS")
        pi = create_entity(db, "PAYMENT_INSTRUMENT")
        
        create_edge(db, cust, addr, "REGISTERED_AT")
        
        # 1 to 5 normal transactions
        for _ in range(random.randint(1, 5)):
            ts = START_DATE + timedelta(days=random.randint(0, 29), hours=random.randint(0, 23))
            merch = random.choice(merchants)
            amount = round(random.uniform(10, 5000), 2)
            create_transaction(db, cust, merch, pi, dev, ip, amount, ts, is_abuse=False)

def create_network(db: Session, scenario: str, is_abuse: bool, entities: list):
    network_id = f"NET-{scenario}-{uuid.uuid4()}"
    net = Network(id=network_id, scenario_type=scenario, is_abuse=is_abuse, created_at=datetime.now())
    db.add(net)
    for ent in entities:
        db.add(NetworkEntity(network_id=network_id, entity_id=ent.id))
    return network_id

def generate_promo_abuse_ring(db: Session, size=20):
    logger.info(f"Generating promo abuse ring of size {size}...")
    
    # They share 3 devices and 2 IPs
    shared_devices = [create_entity(db, "DEVICE") for _ in range(3)]
    shared_ips = [create_entity(db, "IP") for _ in range(2)]
    
    merch = create_entity(db, "MERCHANT", "PromoTarget Merchant")
    base_time = START_DATE + timedelta(days=15)
    
    customers = []
    
    for i in range(size):
        cust = create_entity(db, "CUSTOMER")
        customers.append(cust)
        addr = create_entity(db, "ADDRESS")
        pi = create_entity(db, "PAYMENT_INSTRUMENT")
        
        dev = random.choice(shared_devices)
        ip = random.choice(shared_ips)
        
        create_edge(db, cust, addr, "REGISTERED_AT")
        
        # rapid creation
        ts = base_time + timedelta(minutes=random.randint(1, 120))
        amount = round(random.uniform(500, 550), 2) # similar amounts
        create_transaction(db, cust, merch, pi, dev, ip, amount, ts, is_abuse=True, network_id=None)

    # Trace explicitly to ground truth
    network_id = create_network(db, "PROMO_ABUSE", True, customers + shared_devices + shared_ips + [merch])
    
    # flush so txns are available for query
    db.flush()
    
    # update txns to point to this network
    txns = db.query(Transaction).filter(Transaction.customer_id.in_([c.id for c in customers])).all()
    for txn in txns:
        txn.network_id = network_id

def generate_legitimate_corporate(db: Session, size=30):
    logger.info(f"Generating legitimate corporate network of size {size}...")
    # Many people, 1 shared IP, different devices, different payments
    shared_ip = create_entity(db, "IP")
    merchants = [create_entity(db, "MERCHANT") for _ in range(10)]
    
    customers = []
    
    for _ in range(size):
        cust = create_entity(db, "CUSTOMER")
        customers.append(cust)
        dev = create_entity(db, "DEVICE")
        addr = create_entity(db, "ADDRESS")
        pi = create_entity(db, "PAYMENT_INSTRUMENT")
        
        create_edge(db, cust, addr, "REGISTERED_AT")
        
        for _ in range(random.randint(1, 3)):
            ts = START_DATE + timedelta(days=random.randint(0, 29))
            merch = random.choice(merchants)
            amount = round(random.uniform(50, 2000), 2)
            create_transaction(db, cust, merch, pi, dev, shared_ip, amount, ts, is_abuse=False)

    # Legitimate explicit trace
    create_network(db, "CORPORATE", False, customers + [shared_ip])

def main():
    seed = int(os.getenv("SYNTHETIC_DATA_SEED", "42"))
    random.seed(seed)
    fake.seed_instance(seed)
    
    db = SessionLocal()
    try:
        # Clear existing data for fresh seed
        logger.info("Clearing existing data...")
        db.query(Edge).delete()
        db.query(Transaction).delete()
        db.query(NetworkEntity).delete()
        db.query(Network).delete()
        db.query(Entity).delete()
        db.commit()

        generate_normal_behavior(db, 200)
        generate_legitimate_corporate(db, 40)
        generate_promo_abuse_ring(db, 15)
        generate_promo_abuse_ring(db, 25)
        
        db.commit()
        logger.info("Data generation complete.")
        
        # Validation checks
        total_entities = db.query(Entity).count()
        total_txns = db.query(Transaction).count()
        total_edges = db.query(Edge).count()
        abuse_txns = db.query(Transaction).filter(Transaction.is_abuse == True).count()
        
        logger.info(f"Entities: {total_entities}")
        logger.info(f"Transactions: {total_txns}")
        logger.info(f"Edges: {total_edges}")
        logger.info(f"Abuse Transactions: {abuse_txns}")
        
    except Exception as e:
        logger.error(f"Error during generation: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
