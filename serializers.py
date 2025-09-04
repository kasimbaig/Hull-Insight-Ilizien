from rest_framework import serializers
from .models import *

class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'

class ClassofVesselSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassofVessel
        fields = '__all__'

class VesselTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VesselType
        fields = '__all__'

class DockyardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dockyard
        fields = '__all__'

class CommandSerializer(serializers.ModelSerializer):       
    class Meta:
        model = Command
        fields = '__all__'

class VesselSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vessel
        fields = '__all__'

class VesselDetailSerializer(serializers.ModelSerializer):
    classofvessel = ClassofVesselSerializer()
    vesseltype = VesselTypeSerializer()
    yard = DockyardSerializer()
    command = CommandSerializer()
    class Meta:
        model = Vessel
        fields = '__all__'


class HullCompartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HullCompartment
        fields = '__all__'

class HullSystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = HullSystem
        fields = '__all__'

class HullEquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HullEquipment
        fields = '__all__'

class DamageTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DamageType
        fields = '__all__'

class SeveritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Severity
        fields = '__all__'

class OperationalStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationalStatus
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'

class SubModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubModule
        fields = '__all__'

class SubModuleDetailSerializer(serializers.ModelSerializer):
    module = ModuleSerializer()
    class Meta:
        model = SubModule
        fields = '__all__'


class SurveyCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyCycle
        fields = '__all__'

class SurveyCycleDetailSerializer(serializers.ModelSerializer):
    submodule = SubModuleSerializer()
    class Meta:
        model = SurveyCycle
        fields = '__all__'

