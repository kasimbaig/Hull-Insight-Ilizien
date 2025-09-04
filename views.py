from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import *
from .serializers import *
from Hull.utils import format_errors, Pagination, get_ordering_from_params
# Create your views here.




class UnitAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(Unit, pk=pk, active=1)
            serializer = UnitSerializer(obj)
            return Response(serializer.data)

        filter = dict(request.GET.items())
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        units = Unit.objects.exclude(active=3).order_by(ordering)
        if filter:
            units = units.filter(**filter)
        if search_query:
            units = units.filter(
                Q(name__icontains=search_query) |
                Q(code__icontains=search_query)
            )

        if is_paginated:
            paginator = Pagination()
            paginated_units = paginator.paginate_queryset(units, request)
            serialized_units = UnitSerializer(paginated_units, many=True)
            return paginator.get_paginated_response({
                "status": 200,
                "data": serialized_units.data
            })
        else:
            serialized_units = UnitSerializer(units, many=True)
            return Response({
                "status": 200,
                "data": serialized_units.data
            })


    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)

        if instance_id is not None:
            obj = get_object_or_404(Unit, pk=instance_id)
            obj.modified_by = request.user
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"Unit {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)
            
            else: 
                if 'id' in data:
                    del data['id']
                serializer = UnitSerializer(obj, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)

        else: 
            data['created_by'] = request.user.id
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            
            data['status'] = 1

            serializer = UnitSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)

 
class ClassofVesselAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(ClassofVessel, pk=pk, active=1)
            serializer = ClassofVesselSerializer(obj)
            return Response(serializer.data)

        filter = dict(request.GET.items())
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        classofvessels = ClassofVessel.objects.exclude(active=3).order_by(ordering)
        if filter:
            classofvessels = classofvessels.filter(**filter)
        if search_query:
            classofvessels = classofvessels.filter(
                Q(name__icontains=search_query) |
                Q(code__icontains=search_query)
            )

        if is_paginated:
            paginator = Pagination()
            paginated_classofvessels = paginator.paginate_queryset(classofvessels, request)
            serialized_classofvessels = ClassofVesselSerializer(paginated_classofvessels, many=True)
            return paginator.get_paginated_response({
                "status": 200,
                "data": serialized_classofvessels.data
            })
        else:
            serialized_classofvessels = ClassofVesselSerializer(classofvessels, many=True)
            return Response({
                "status": 200,
                "data": serialized_classofvessels.data
            })
    

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)

        if instance_id is not None:
            obj = get_object_or_404(ClassofVessel, pk=instance_id)
            obj.modified_by = request.user
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"Class of Ship {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)
            else:
                if 'id' in data:
                    del data['id']
                serializer = ClassofVesselSerializer(obj, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['created_by'] = request.user.id
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = ClassofVesselSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)


class VesselTypeAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(VesselType, pk=pk, active=1)
            serializer = VesselTypeSerializer(obj)
            return Response(serializer.data)
        
        filter = dict(request.GET.items())
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        vesseltypes = VesselType.objects.exclude(active=3).order_by(ordering)
        if filter:
            vesseltypes = vesseltypes.filter(**filter)
        if search_query:
            vesseltypes = vesseltypes.filter(
                Q(name__icontains=search_query) |
                Q(code__icontains=search_query)
            )

        if is_paginated:
            paginator = Pagination()
            paginated_vesseltypes = paginator.paginate_queryset(vesseltypes, request)
            serialized_vesseltypes = VesselTypeSerializer(paginated_vesseltypes, many=True)
            return paginator.get_paginated_response({
                "status": 200,
                "data": serialized_vesseltypes.data
            })
        else:
            serialized_vesseltypes = VesselTypeSerializer(vesseltypes, many=True)
            return Response({
                "status": 200,
                "data": serialized_vesseltypes.data
            })

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)

        if instance_id is not None: 
            obj = get_object_or_404(VesselType, pk=instance_id)
            obj.modified_by = request.user
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"Vessel Type {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)
            else:
                if 'id' in data:
                    del data['id']
                serializer = VesselTypeSerializer(obj, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['created_by'] = request.user.id
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = VesselTypeSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)


class DockyardAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(Dockyard, pk=pk, active=1)
            serializer = DockyardSerializer(obj)
            return Response(serializer.data)

        filter = dict(request.GET.items())
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        dockyards = Dockyard.objects.exclude(active=3).order_by(ordering)
        if filter:
            dockyards = dockyards.filter(**filter)
        if search_query:
            dockyards = dockyards.filter(
                Q(name__icontains=search_query) |
                Q(code__icontains=search_query)
            )

        if is_paginated:
            paginator = Pagination()
            paginated_dockyards = paginator.paginate_queryset(dockyards, request)
            serialized_dockyards = DockyardSerializer(paginated_dockyards, many=True)
            return paginator.get_paginated_response({
                "status": 200,
                "data": serialized_dockyards.data
            })
        else:
            serialized_dockyards = DockyardSerializer(dockyards, many=True)
            return Response({
                "status": 200,
                "data": serialized_dockyards.data
            })

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)

        if instance_id is not None:
            obj = get_object_or_404(Dockyard, pk=instance_id)
            obj.modified_by = request.user
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"Dockyard {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)
            else:
                if 'id' in data:
                    del data['id']
                serializer = DockyardSerializer(obj, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK) 
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['created_by'] = request.user.id
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = DockyardSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)  
        

class CommandAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(Command, pk=pk, active=1)
            serializer = CommandSerializer(obj)
            return Response(serializer.data)

        filter = dict(request.GET.items())
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        commands = Command.objects.exclude(active=3).order_by(ordering)
        if filter:
            commands = commands.filter(**filter)
        if search_query:
            commands = commands.filter(
                Q(name__icontains=search_query) |       
                Q(code__icontains=search_query)
            )

        if is_paginated:
            paginator = Pagination()
            paginated_commands = paginator.paginate_queryset(commands, request)
            serialized_commands = CommandSerializer(paginated_commands, many=True)
            return paginator.get_paginated_response({
                "status": 200,  
                "data": serialized_commands.data
            })
        else:
            serialized_commands = CommandSerializer(commands, many=True)
            return Response({
                "status": 200,
                "data": serialized_commands.data
            })

    def post(self, request, *args, **kwargs):       
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)

        if instance_id is not None:
            obj = get_object_or_404(Command, pk=instance_id)
            obj.modified_by = request.user
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:  
                obj.active = 3
                obj.save()
                return Response({"message": f"Command {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)
            else:
                if 'id' in data:
                    del data['id']
                serializer = CommandSerializer(obj, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:       
            data['created_by'] = request.user.id
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = CommandSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)



class VesselAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(Vessel, pk=pk, active=1)
            serializer = VesselDetailSerializer(obj)
            return Response(serializer.data)

        filter = dict(request.GET.items())
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter     
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        vessels = Vessel.objects.exclude(active=3).order_by(ordering)
        if filter:
            vessels = vessels.filter(**filter)
        if search_query:
            vessels = vessels.filter(
                Q(name__icontains=search_query) |       
                Q(code__icontains=search_query)
            )

        if is_paginated:
            paginator = Pagination()
            paginated_vessels = paginator.paginate_queryset(vessels, request)
            serialized_vessels = VesselDetailSerializer(paginated_vessels, many=True)
            return paginator.get_paginated_response({
                "status": 200,
                "data": serialized_vessels.data
            })
        else:   
            serialized_vessels = VesselDetailSerializer(vessels, many=True)
            return Response({
                "status": 200,
                "data": serialized_vessels.data
            })

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)  
        delete = request.data.get("delete", False)

        if instance_id is not None:
            obj = get_object_or_404(Vessel, pk=instance_id)
            obj.modified_by = request.user
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"Vessel {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)       
            else:
                if 'id' in data:
                    del data['id']
                serializer = VesselSerializer(obj, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:   
            data['created_by'] = request.user.id
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = VesselSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
    

class HullCompartmentAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(HullCompartment, pk=pk, active=1)
            serializer = HullCompartmentSerializer(obj)
            return Response(serializer.data)

        filter = dict(request.GET.items())  
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        hull_compartments = HullCompartment.objects.exclude(active=3).order_by(ordering)
        if filter:
            hull_compartments = hull_compartments.filter(**filter)
        if search_query:
            hull_compartments = hull_compartments.filter(
                Q(name__icontains=search_query) |       
                Q(code__icontains=search_query)
            )

        if is_paginated:
            paginator = Pagination()
            paginated_hull_compartments = paginator.paginate_queryset(hull_compartments, request)
            serialized_hull_compartments = HullCompartmentSerializer(paginated_hull_compartments, many=True)
            return paginator.get_paginated_response({
                "status": 200,
                "data": serialized_hull_compartments.data
            })

        else:
            serialized_hull_compartments = HullCompartmentSerializer(hull_compartments, many=True)
            return Response({
                "status": 200,
                "data": serialized_hull_compartments.data
            }) 

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)

        if instance_id is not None:
            obj = get_object_or_404(HullCompartment, pk=instance_id)
            obj.modified_by = request.user
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"Hull Compartment {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)
            else:
                if 'id' in data:
                    del data['id']
                serializer = HullCompartmentSerializer(obj, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)  
        else:
            data['created_by'] = request.user.id
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = HullCompartmentSerializer(data=data)
            if serializer.is_valid():       
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)


class HullSystemAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(HullSystem, pk=pk, active=1)
            serializer = HullSystemSerializer(obj)
            return Response(serializer.data)

        filter = dict(request.GET.items())  
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        hull_systems = HullSystem.objects.exclude(active=3).order_by(ordering)
        if filter:
            hull_systems = hull_systems.filter(**filter)
        if search_query:    
            hull_systems = hull_systems.filter(
                Q(name__icontains=search_query) |
                Q(code__icontains=search_query)
            )

        if is_paginated:
            paginator = Pagination()
            paginated_hull_systems = paginator.paginate_queryset(hull_systems, request)
            serialized_hull_systems = HullSystemSerializer(paginated_hull_systems, many=True)       
            return paginator.get_paginated_response({
                "status": 200,
                "data": serialized_hull_systems.data
            })
        else:
            serialized_hull_systems = HullSystemSerializer(hull_systems, many=True)
            return Response({
                "status": 200,
                "data": serialized_hull_systems.data
            })  

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)
        if instance_id is not None:
            obj = get_object_or_404(HullSystem, pk=instance_id)
            obj.modified_by = request.user  
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"Hull System {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)
            else:
                if 'id' in data:
                    del data['id']
                serializer = HullSystemSerializer(obj, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['created_by'] = request.user.id
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = HullSystemSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)  
        

class HullEquipmentAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(HullEquipment, pk=pk, active=1)
            serializer = HullEquipmentSerializer(obj)
            return Response(serializer.data)

        filter = dict(request.GET.items())
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        hull_equipments = HullEquipment.objects.exclude(active=3).order_by(ordering)
        if filter:
            hull_equipments = hull_equipments.filter(**filter)
        if search_query:    
            hull_equipments = hull_equipments.filter(
                Q(name__icontains=search_query) |
                Q(code__icontains=search_query)
            )

        if is_paginated:
            paginator = Pagination()
            paginated_hull_equipments = paginator.paginate_queryset(hull_equipments, request)
            serialized_hull_equipments = HullEquipmentSerializer(paginated_hull_equipments, many=True)  
            return paginator.get_paginated_response({
                "status": 200,
                "data": serialized_hull_equipments.data
            })
        else:
            serialized_hull_equipments = HullEquipmentSerializer(hull_equipments, many=True)
            return Response({
                "status": 200,
                "data": serialized_hull_equipments.data 
            })

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)
        if instance_id is not None:
            obj = get_object_or_404(HullEquipment, pk=instance_id)
            obj.modified_by = request.user      
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"Hull Equipment {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)
            else:
                if 'id' in data:
                    del data['id']
                serializer = HullEquipmentSerializer(obj, data=data, partial=True)      
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['created_by'] = request.user.id
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = HullEquipmentSerializer(data=data) 
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)


class DamageTypeAPIView(APIView):
    def get(self, request, pk=None):
        if pk:      
            obj = get_object_or_404(DamageType, pk=pk, active=1)
            serializer = DamageTypeSerializer(obj)
            return Response(serializer.data)

        filter = dict(request.GET.items())
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter
        if is_paginated:
            filter.pop('page')      
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        damage_types = DamageType.objects.exclude(active=3).order_by(ordering)
        if filter:
            damage_types = damage_types.filter(**filter)
        if search_query:
            damage_types = damage_types.filter(
                Q(name__icontains=search_query) |
                Q(code__icontains=search_query)
            )       

        if is_paginated:
            paginator = Pagination()
            paginated_damage_types = paginator.paginate_queryset(damage_types, request)
            serialized_damage_types = DamageTypeSerializer(paginated_damage_types, many=True)
            return paginator.get_paginated_response({
                "status": 200,
                "data": serialized_damage_types.data
            })
        else:       
            serialized_damage_types = DamageTypeSerializer(damage_types, many=True)
            return Response({
                "status": 200,
                "data": serialized_damage_types.data
            })

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)
        if instance_id is not None:
            obj = get_object_or_404(DamageType, pk=instance_id)
            obj.modified_by = request.user
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"Damage Type {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)      
            else:
                if 'id' in data:
                    del data['id']
                serializer = DamageTypeSerializer(obj, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['created_by'] = request.user.id   
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = DamageTypeSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
    

class SeverityAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(Severity, pk=pk, active=1)
            serializer = SeveritySerializer(obj)
            return Response(serializer.data)

        filter = dict(request.GET.items())      
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        severities = Severity.objects.exclude(active=3).order_by(ordering)
        if filter:
            severities = severities.filter(**filter)
        if search_query:
            severities = severities.filter(
                Q(name__icontains=search_query) |
                Q(code__icontains=search_query)
            )

        if is_paginated:
            paginator = Pagination()
            paginated_severities = paginator.paginate_queryset(severities, request)
            serialized_severities = SeveritySerializer(paginated_severities, many=True)
            return paginator.get_paginated_response({
                "status": 200,
                "data": serialized_severities.data
            })
        else:
            serialized_severities = SeveritySerializer(severities, many=True)
            return Response({
                "status": 200,
                "data": serialized_severities.data
            })
        
    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)
        if instance_id is not None:
            obj = get_object_or_404(Severity, pk=instance_id)
            obj.modified_by = request.user
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"Severity {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)
            else:
                if 'id' in data:
                    del data['id']
                serializer = SeveritySerializer(obj, data=data, partial=True)
                if serializer.is_valid():   
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['created_by'] = request.user.id
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = SeveritySerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)


class OperationalStatusAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(OperationalStatus, pk=pk, active=1)     
            serializer = OperationalStatusSerializer(obj)
            return Response(serializer.data)
        
        filter = dict(request.GET.items())
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        operational_statuses = OperationalStatus.objects.exclude(active=3).order_by(ordering)
        if filter:  
            operational_statuses = operational_statuses.filter(**filter)
        if search_query:
            operational_statuses = operational_statuses.filter(
                Q(name__icontains=search_query) |
                Q(code__icontains=search_query)
            )

        if is_paginated:
            paginator = Pagination()
            paginated_operational_statuses = paginator.paginate_queryset(operational_statuses, request) 
            serialized_operational_statuses = OperationalStatusSerializer(paginated_operational_statuses, many=True)
            return paginator.get_paginated_response({
                "status": 200,
                "data": serialized_operational_statuses.data
            })
        else:
            serialized_operational_statuses = OperationalStatusSerializer(operational_statuses, many=True)
            return Response({
                "status": 200,  
                "data": serialized_operational_statuses.data
            })

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)
        if instance_id is not None:
            obj = get_object_or_404(OperationalStatus, pk=instance_id)  
            obj.modified_by = request.user
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"Operational Status {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)
            else:
                if 'id' in data:
                    del data['id']  
                serializer = OperationalStatusSerializer(obj, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['created_by'] = request.user.id
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = OperationalStatusSerializer(data=data) 
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)


class ModuleAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(Module, pk=pk, active=1)
            serializer = ModuleSerializer(obj)
            return Response(serializer.data)

        filter = dict(request.GET.items())
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter     
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        modules = Module.objects.exclude(active=3).order_by(ordering)
        if filter:
            modules = modules.filter(**filter)
        if search_query:
            modules = modules.filter(
                Q(name__icontains=search_query) |
                Q(code__icontains=search_query)
            )   

        if is_paginated:
            paginator = Pagination()
            paginated_modules = paginator.paginate_queryset(modules, request)
            serialized_modules = ModuleSerializer(paginated_modules, many=True)
            return paginator.get_paginated_response({
                "status": 200,
                "data": serialized_modules.data
            })
        else:
            serialized_modules = ModuleSerializer(modules, many=True)
            return Response({
                "status": 200,
                "data": serialized_modules.data
            })

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)  
        if instance_id is not None:
            obj = get_object_or_404(Module, pk=instance_id)
            obj.modified_by = request.user
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"Module {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)
            else:   
                if 'id' in data:
                    del data['id']
                serializer = ModuleSerializer(obj, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['created_by'] = request.user.id    
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = ModuleSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)

class SubModuleAPIView(APIView):    
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(SubModule, pk=pk, active=1)
            serializer = SubModuleDetailSerializer(obj)
            return Response(serializer.data)

        filter = dict(request.GET.items())
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter 
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        submodules = SubModule.objects.exclude(active=3).order_by(ordering)
        if filter:
            submodules = submodules.filter(**filter)
        if search_query:
            submodules = submodules.filter(
                Q(name__icontains=search_query) |   
                Q(module__name__icontains=search_query)
            )

        if is_paginated:
            paginator = Pagination()
            paginated_submodules = paginator.paginate_queryset(submodules, request)
            serialized_submodules = SubModuleDetailSerializer(paginated_submodules, many=True)
            return paginator.get_paginated_response({
                "status": 200,  
                "data": serialized_submodules.data
            })

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)
        if instance_id is not None:
            obj = get_object_or_404(SubModule, pk=instance_id)  
            obj.modified_by = request.user
            obj.modified_ip = request.META.get('REMOTE_ADDR')
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"SubModule {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)
            else:
                if 'id' in data:
                    del data['id']  
                serializer = SubModuleSerializer(obj, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['created_by'] = request.user.id
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = SubModuleSerializer(data=data) 
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)


class SurveyCycleAPIView(APIView):
    def get(self, request, pk=None):
        if pk:
            obj = get_object_or_404(SurveyCycle, pk=pk, active=1)
            serializer = SurveyCycleDetailSerializer(obj)
            return Response(serializer.data)

        filter = dict(request.GET.items())
        search_query = filter.pop('search', None)
        is_paginated = 'page' in filter     
        if is_paginated:
            filter.pop('page')
        
        # Remove ordering parameters from filter
        filter.pop('order_by', None)
        filter.pop('order_type', None)

        # Get ordering from request parameters
        ordering = get_ordering_from_params(request, default_order='-id')
        survey_cycles = SurveyCycle.objects.exclude(active=3).order_by(ordering)
        if filter:
            survey_cycles = survey_cycles.filter(**filter)
        if search_query:
            survey_cycles = survey_cycles.filter(
                Q(name__icontains=search_query) |       
                Q(submodule__name__icontains=search_query)
            )

        if is_paginated:
            paginator = Pagination()
            paginated_survey_cycles = paginator.paginate_queryset(survey_cycles, request)
            serialized_survey_cycles = SurveyCycleDetailSerializer(paginated_survey_cycles, many=True)
            return paginator.get_paginated_response({
                "status": 200,  
                "data": serialized_survey_cycles.data
            })
        else:
            serialized_survey_cycles = SurveyCycleDetailSerializer(survey_cycles, many=True)
            return Response({
                "status": 200,  
                "data": serialized_survey_cycles.data
            })
    
    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        instance_id = data.get('id', None)
        delete = request.data.get("delete", False)
        if instance_id is not None:
            obj = get_object_or_404(SurveyCycle, pk=instance_id)
            obj.modified_by = request.user
            obj.modified_ip = request.META.get('REMOTE_ADDR')   
            if delete:
                obj.active = 3
                obj.save()
                return Response({"message": f"Survey Cycle {obj.name} marked as deleted successfully."}, status=status.HTTP_200_OK)
            else:
                if 'id' in data:
                    del data['id']
                serializer = SurveyCycleSerializer(obj, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['created_by'] = request.user.id
            data['created_ip'] = request.META.get('REMOTE_ADDR')
            data['status'] = 1
            serializer = SurveyCycleSerializer(data=data)
            if serializer.is_valid():   
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"message": format_errors(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)


