import os
import django

# Configure o Django para rodar o script standalone
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'meutcc.settings')  # Caminho correto do settings.py
django.setup()

from app.models.tcc import Tcc  # Caminho correto do modelo TCC

def listar_models_relacionadas():
    tcc_model = Tcc._meta
    related_models = [rel.related_model for rel in tcc_model.related_objects]
    return related_models

if __name__ == '__main__':
    print("Models relacionadas com TCC:")
    related_models = listar_models_relacionadas()
    for model in related_models:
        print(model.__name__)
