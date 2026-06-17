import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        port=5455,
        database="KanYonetimDb",
        user="postgres",
        password="postgrespassword"
    )
    cur = conn.cursor()
    cur.execute('SELECT "FullName", "Email", "BloodTypeId", "LastDonationDate" FROM "Users" WHERE "FullName" LIKE \'%Ayşe%\';')
    rows = cur.fetchall()
    print("AYSE USERS:")
    for r in rows:
        print(r)
    
    cur.execute('SELECT "Id", "Name" FROM "BloodTypes";')
    print("BLOOD TYPES:")
    for r in cur.fetchall():
        print(r)

    cur.close()
    conn.close()
except Exception as e:
    print("Error:", e)
