from django.db import models
from Hull.settings import AUTH_USER_MODEL
User = AUTH_USER_MODEL
from access.models import Base

# Create your models here.
class Unit(Base):
    name = models.CharField(max_length=255)


class ClassofVessel(Base):
    name = models.CharField(max_length=255)


class VesselType(Base):
    name = models.CharField(max_length=255)


class Dockyard(Base):
    name = models.CharField(max_length=255)


class Command(Base):
    name = models.CharField(max_length=255)

class Vessel(Base):
    name = models.CharField(max_length=255)
    classofvessel = models.ForeignKey(ClassofVessel, on_delete=models.CASCADE)
    vesseltype = models.ForeignKey(VesselType, on_delete=models.CASCADE)
    yard = models.ForeignKey(Dockyard, on_delete=models.CASCADE)
    command = models.ForeignKey(Command, on_delete=models.CASCADE)
    year_of_build = models.IntegerField()
    year_of_delivery = models.IntegerField()

class HullCompartment(Base):
    name = models.TextField(null=True, blank=True)
    remark = models.TextField(null=True, blank=True)
    ser = models.TextField(null=True, blank=True)
    numbers = models.TextField(null=True, blank=True)
    location = models.TextField(null=True, blank=True)
    equipment = models.TextField(null=True, blank=True)
    features = models.TextField(null=True, blank=True)
    layout = models.TextField(null=True, blank=True)
    special_requirements = models.TextField(null=True, blank=True)
    standards = models.TextField(null=True, blank=True)

class HullSystem(Base):
    name = models.TextField(null=True, blank=True)
    remark = models.TextField(null=True, blank=True)
    ser = models.TextField(null=True, blank=True)
    numbers = models.TextField(null=True, blank=True)
    capabilities_feature = models.TextField(null=True, blank=True)
    weight_volume_power_consumption = models.TextField(null=True, blank=True)
    location = models.TextField(null=True, blank=True)
    interface = models.TextField(null=True, blank=True)
    procurement_router = models.TextField(null=True, blank=True)
    vendor = models.TextField(null=True, blank=True)
    cost = models.TextField(null=True, blank=True)
    standards = models.TextField(null=True, blank=True)
    sustenance = models.TextField(null=True, blank=True)
    flag  = models.CharField(max_length=20,null=True,blank=True)
    sotr_type = models.TextField(null=True, blank=True)
    sequence = models.IntegerField(null=True)

class HullEquipment(Base):
    name = models.TextField(null=True, blank=True)
    weight_volume_power_consumption = models.TextField(null=True, blank=True)
    procurement_router = models.TextField(null=True, blank=True)
    remark = models.TextField(null=True, blank=True)
    vendor = models.TextField(null=True, blank=True)
    cost = models.TextField(null=True, blank=True)
    sustenance = models.TextField(null=True, blank=True)
    ser = models.TextField(null=True, blank=True)
    numbers = models.TextField(null=True, blank=True)
    capabilities_feature = models.TextField(null=True, blank=True)
    location = models.TextField(null=True, blank=True)
    interface = models.TextField(null=True, blank=True)
    standards = models.TextField(null=True, blank=True)
    flag  = models.CharField(max_length=20,null=True,blank=True)
    sotr_type = models.TextField(null=True, blank=True)
    equipment_type_name = models.CharField(
        max_length=15, null=True, blank=True)


class DamageType(Base):
    name = models.TextField()


class Severity(Base):
    name = models.TextField()


class OperationalStatus(Base):
    name = models.TextField()


class Module(Base):
    name = models.TextField(null=True, blank=True)


class SubModule(Base):
    name = models.TextField(null=True, blank=True)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)



class SurveyCycle(models.Model):
    CYCLE_TYPE_CHOICES = [
        ('DAYS', 'Days'),
        ('MONTHS', 'Months'),
        ('REFIT', 'Refit-to-Refit'),
    ]

    name = models.CharField(max_length=100, unique=True)  # e.g., "Quarterly"
    cycle_unit = models.CharField(max_length=10, choices=CYCLE_TYPE_CHOICES)
    cycle_value = models.PositiveIntegerField(null=True, blank=True)  # e.g., 3 (months) or 90 (days)
    description = models.TextField(blank=True)
    submodule = models.ForeignKey(SubModule, on_delete=models.CASCADE)

    def __str__(self):
        return self.name



class DynamicField(models.Model):
    FIELD_TYPES = [
        ('text', 'Text'),
        ('number', 'Number'),
        ('dropdown', 'Dropdown'),
        ('date', 'Date'),
    ]

    sub_module = models.ForeignKey(SubModule, on_delete=models.CASCADE, related_name='fields')
    label = models.CharField(max_length=255)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES)
    required = models.BooleanField(default=False)

    # For static dropdowns
    dropdown_options = models.TextField(blank=True, help_text="Comma-separated values for static dropdowns")

    # NEW: for dynamic dropdowns from a master model
    data_source = models.CharField(
        max_length=255,
        blank=True,
        help_text="Dotted path to model for dynamic dropdown, e.g., 'core.models.Equipment'"
    )

    def get_options(self):
        if self.field_type != 'dropdown':
            return []

        if self.data_source:
            # dynamic dropdown from a model
            from django.apps import apps
            try:
                model = apps.get_model(self.data_source)
                return list(model.objects.values('id', 'name'))  # expects `name` field
            except Exception as e:
                return [{'error': str(e)}]
        else:
            # static dropdown
            return [{'label': opt.strip(), 'value': opt.strip()} for opt in self.dropdown_options.split(',')]


