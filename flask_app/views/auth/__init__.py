import binascii
import os


def create_code():
    return binascii.hexlify(os.urandom(32)).decode()
