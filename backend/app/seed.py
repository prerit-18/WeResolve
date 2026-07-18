import datetime
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from . import models, auth

def seed_db():
    # Clear existing tables and recreate
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Seed Users
        admin_pass = auth.get_password_hash("admin123")
        solver_pass = auth.get_password_hash("solver123")
        citizen_pass = auth.get_password_hash("citizen123")
        
        admin = models.User(
            email="admin@weresolve.gov",
            hashed_password=admin_pass,
            full_name="Admin",
            role="admin",
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
        )
        
        arjun = models.User(
            email="arjun@weresolve.org",
            hashed_password=solver_pass,
            full_name="Arjun Kumar",
            role="solver",
            credits=0,
            xp=0,
            level=1,
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
        )
        
        rohit = models.User(
            email="rohit@weresolve.org",
            hashed_password=solver_pass,
            full_name="Rohit Sharma",
            role="solver",
            credits=520,
            xp=450,
            level=5,
            avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
        )
 
        sneha = models.User(
            email="sneha@weresolve.org",
            hashed_password=solver_pass,
            full_name="Sneha Reddy",
            role="solver",
            credits=410,
            xp=320,
            level=4,
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
        )
 
        suresh = models.User(
            email="suresh@weresolve.org",
            hashed_password=solver_pass,
            full_name="Suresh P.",
            role="solver",
            credits=95,
            xp=45,
            level=1,
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh",
        )
        
        citizen = models.User(
            email="citizen@weresolve.org",
            hashed_password=citizen_pass,
            full_name="Amit Patel",
            role="citizen",
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
        )
        
        db.add_all([admin, arjun, rohit, sneha, suresh, citizen])
        db.commit() # Commit to get IDs
        
        # 2. Seed Issues (Available Issues list)
        issue1 = models.Issue(
            id=1250, # Map to UP-1250
            citizen_id=citizen.id,
            title="Large pothole on 5th Main Road",
            description="A dangerous large pothole is filled with rainwater on 5th Main Road, slowing traffic and causing severe safety hazards for motorbikes.",
            category="Road Damage",
            priority="High",
            status="In Progress",
            latitude=12.9348,
            longitude=77.6208,
            image_url="http://localhost:8000/uploads/issue1.png",
        )
        
        issue2 = models.Issue(
            id=1249, # Map to UP-1249
            citizen_id=citizen.id,
            title="Garbage overflow near BDA Park",
            description="Trash and debris are piling up next to BDA Park fence. Bad odor and health concern for visiting children.",
            category="Garbage",
            priority="Medium",
            status="Pending",
            latitude=12.9372,
            longitude=77.6231,
            image_url="http://localhost:8000/uploads/issue2.png",
        )
        
        issue3 = models.Issue(
            id=1248, # Map to UP-1248
            citizen_id=citizen.id,
            title="Street light not working",
            description="The entire crossroad near sector 3 HSR is pitch dark as the main street lamp is broken.",
            category="Street Light",
            priority="Medium",
            status="In Progress",
            latitude=12.9116,
            longitude=77.6388,
            image_url="http://localhost:8000/uploads/issue3.png",
        )

        issue4 = models.Issue(
            id=1247, # Map to UP-1247
            citizen_id=citizen.id,
            title="Water leakage near 7th Cross",
            description="Water is constantly leaking from the public utility pipeline near 7th cross, flooding the gutter.",
            category="Water Supply",
            priority="Low",
            status="Pending",
            latitude=12.9304,
            longitude=77.6255,
            image_url="http://localhost:8000/uploads/issue4.png",
        )

        issue5 = models.Issue(
            id=1246, # Map to UP-1246
            citizen_id=citizen.id,
            title="Wall graffiti on public property",
            description="Unapproved graffiti tagging painted on the municipal concrete walls near 4th block.",
            category="Others",
            priority="Low",
            status="Pending",
            latitude=12.9331,
            longitude=77.6189,
            image_url="http://localhost:8000/uploads/issue5.png",
        )

        # Issues representing Pending Verifications on the right side
        issue_ver1 = models.Issue(
            id=1245,
            citizen_id=citizen.id,
            title="Garbage cleared near 7th Block",
            description="Cleared overflow garbage near 7th block.",
            category="Garbage",
            priority="Medium",
            status="Completed", # Waiting for admin approval
            latitude=12.9312,
            longitude=77.6241,
            image_url="http://localhost:8000/uploads/garbage_before.png",
        )

        issue_ver2 = models.Issue(
            id=1241,
            citizen_id=citizen.id,
            title="Pothole fixed on 4th Main Road",
            description="Fixed pothole on 4th main road.",
            category="Road Damage",
            priority="High",
            status="Completed", # Waiting for admin approval
            latitude=12.9328,
            longitude=77.6198,
            image_url="http://localhost:8000/uploads/pothole_before.png",
        )
        
        db.add_all([issue1, issue2, issue3, issue4, issue5, issue_ver1, issue_ver2])
        db.commit()
        
        # 3. Seed Tasks (Solver acceptances)
        # Task for Arjun: Pothole
        task1 = models.Task(
            id=1,
            issue_id=issue1.id,
            solver_id=arjun.id,
            status="In Progress",
            before_image=issue1.image_url,
        )
        
        # Task for Arjun: Street Light
        task2 = models.Task(
            id=2,
            issue_id=issue3.id,
            solver_id=arjun.id,
            status="In Progress",
            before_image=issue3.image_url,
        )

        # Task for Arjun: Garbage cleared (Pending approval)
        task3 = models.Task(
            id=1245,
            issue_id=issue_ver1.id,
            solver_id=arjun.id,
            status="Completed",
            before_image="http://localhost:8000/uploads/garbage_before.png",
            after_image="http://localhost:8000/uploads/garbage_after.png",
            completed_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=45),
        )

        # Task for Suresh: Pothole fixed (Pending approval)
        task4 = models.Task(
            id=1241,
            issue_id=issue_ver2.id,
            solver_id=suresh.id,
            status="Completed",
            before_image="http://localhost:8000/uploads/pothole_before.png",
            after_image="http://localhost:8000/uploads/pothole_after.png",
            completed_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=30),
        )
        
        db.add_all([task1, task2, task3, task4])
        
        # 4. Seed Alerts
        alert1 = models.Alert(
            text="High priority issue reported in HSR Layout, Sector 2",
            type="alert",
            time_ago="10 mins ago",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=10)
        )
        alert2 = models.Alert(
            text="New issue reported in Koramangala 7th Block",
            type="warning",
            time_ago="25 mins ago",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=25)
        )
        alert3 = models.Alert(
            text="Solver submitted verification for issue #UP-1245",
            type="success",
            time_ago="45 mins ago",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=45)
        )
        alert4 = models.Alert(
            text="Issue #UP-1220 marked as resolved",
            type="success",
            time_ago="1 hour ago",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=1)
        )
        db.add_all([alert1, alert2, alert3, alert4])
        
        # 5. Seed Notifications
        notif1 = models.Notification(
            user_id=arjun.id,
            title="Task Accepted",
            message="You have accepted the task: 'Street light not working'.",
        )
        notif2 = models.Notification(
            user_id=arjun.id,
            title="Verification Submitted",
            message="Your proof of work for 'Garbage cleared near 7th Block' has been submitted.",
        )
        db.add_all([notif1, notif2])
        
        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
