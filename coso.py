import os

CARPETAS = [
    "app",
    "components",
    "config",
    "constants",
    "hooks",
]

def contar_recursivo(path):
    archivos = 0
    carpetas = 0

    for root, dirs, files in os.walk(path):
        carpetas += len(dirs)
        archivos += len(files)

    return archivos, carpetas


if __name__ == "__main__":
    print("Conteo recursivo por carpeta:\n")

    for carpeta in CARPETAS:
        if os.path.isdir(carpeta):
            archivos, carpetas = contar_recursivo(carpeta)
            print(f"{carpeta}/")
            print(f"  - Archivos: {archivos}")
            print(f"  - Carpetas: {carpetas}\n")
        else:
            print(f"{carpeta}/ NO EXISTE\n")
