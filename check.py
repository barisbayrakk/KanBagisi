import bcrypt
stored = b"$2a$11$c73KOesiGS5hZWBRdaf..e4PiFEoAFsm4xLFSHV7YK//wAoNoWMDe"
print("Matches Sifre123!:", bcrypt.checkpw(b"Sifre123!", stored))
