# Generated by Django 4.2.6 on 2024-03-23 23:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_sessaoprevia_banca_bancaprioridade'),
    ]

    operations = [
        migrations.DeleteModel(
            name='GrauAcademico',
        ),
    ]