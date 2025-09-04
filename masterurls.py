from django.urls import path
from . import views

urlpatterns = [
    path('units/', views.UnitAPIView.as_view(), name='unit-list'),
    path('units/<int:pk>/', views.UnitAPIView.as_view(), name='unit-detail'),
    path('commands/', views.CommandAPIView.as_view(), name='command-list'),
    path('commands/<int:pk>/', views.CommandAPIView.as_view(), name='command-detail'),
    path('classofvessels/', views.ClassofVesselAPIView.as_view(), name='classofvessel-list'),
    path('classofvessels/<int:pk>/', views.ClassofVesselAPIView.as_view(), name='classofvessel-detail'),
    path('vesseltypes/', views.VesselTypeAPIView.as_view(), name='vesseltype-list'),
    path('vesseltypes/<int:pk>/', views.VesselTypeAPIView.as_view(), name='vesseltype-detail'),
    path('dockyards/', views.DockyardAPIView.as_view(), name='dockyard-list'),
    path('dockyards/<int:pk>/', views.DockyardAPIView.as_view(), name='dockyard-detail'),
    path('vessels/', views.VesselAPIView.as_view(), name='vessel-list'),
    path('vessels/<int:pk>/', views.VesselAPIView.as_view(), name='vessel-detail'),
    path('compartments/', views.HullCompartmentAPIView.as_view(), name='compartment-list'),
    path('compartments/<int:pk>/', views.HullCompartmentAPIView.as_view(), name='compartment-detail'),
    path('systems/', views.HullSystemAPIView.as_view(), name='system-list'),
    path('systems/<int:pk>/', views.HullSystemAPIView.as_view(), name='system-detail'),
    path('equipments/', views.HullEquipmentAPIView.as_view(), name='equipment-list'),
    path('equipments/<int:pk>/', views.HullEquipmentAPIView.as_view(), name='equipment-detail'),
    path('damagetypes/', views.DamageTypeAPIView.as_view(), name='damagetype-list'),
    path('damagetypes/<int:pk>/', views.DamageTypeAPIView.as_view(), name='damagetype-detail'),
    path('severities/', views.SeverityAPIView.as_view(), name='severity-list'),
    path('severities/<int:pk>/', views.SeverityAPIView.as_view(), name='severity-detail'),
    path('operationalstatuses/', views.OperationalStatusAPIView.as_view(), name='operationalstatus-list'),
    path('operationalstatuses/<int:pk>/', views.OperationalStatusAPIView.as_view(), name='operationalstatus-detail'),
    path('modules/', views.ModuleAPIView.as_view(), name='module-list'),
    path('modules/<int:pk>/', views.ModuleAPIView.as_view(), name='module-detail'),
    path('submodules/', views.SubModuleAPIView.as_view(), name='submodule-list'),
    path('submodules/<int:pk>/', views.SubModuleAPIView.as_view(), name='submodule-detail'),
    
]