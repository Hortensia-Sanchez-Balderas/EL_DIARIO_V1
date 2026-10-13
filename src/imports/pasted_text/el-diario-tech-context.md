CONTEXTO TÉCNICO DEL PROYECTO "EL DIARIO"
1. Contexto general

El proyecto EL DIARIO consiste en el desarrollo de un sistema web para el departamento de ventas del Grupo Multimedia “El Diario de Coahuila”.

El sistema debe implementar los procesos de negocio definidos previamente en el proyecto de Interacción Humano-Computadora (IHC). La propuesta de IHC y el prototipo desarrollado en Figma son la referencia funcional principal del proyecto.

No se deben modificar los procesos de negocio, roles, módulos funcionales, flujo comercial ni organización definida previamente.

El objetivo del desarrollo técnico es construir el sistema que implemente dichos procesos.

El sistema permitirá administrar información relacionada con:

Empleados del área de ventas.
Prospectos.
Clientes.
Productos y servicios.
Paquetes y tarifas.
Contratos.
Detalles de contratos.
Registro de actividades.
Seguimiento del proceso comercial.

El sistema contempla servicios relacionados con los medios de periódico y radio, de acuerdo con los servicios definidos por la empresa.

2. Arquitectura general

Se utilizará una arquitectura por capas con comunicación mediante API REST.

El frontend y backend estarán dentro del mismo repositorio y carpeta principal del proyecto, pero estarán separados por responsabilidad.

La estructura conceptual será:

EL-DIARIO/
│
├── Backend/
│   └── API ASP.NET Core
│
├── Frontend/
│   └── Vue + TypeScript
│
└── documentación / configuración

No se crearán repositorios independientes para frontend y backend.

La comunicación será:

┌──────────────────────────┐
│        FRONTEND          │
│                          │
│      Vue + TypeScript    │
│                          │
│ Pages / Views            │
│ Components               │
│ Services                 │
└────────────┬─────────────┘
             │
             │ HTTP / HTTPS
             │ REST API
             ▼
┌──────────────────────────┐
│         BACKEND          │
│                          │
│     ASP.NET Core API     │
│          C#              │
│                          │
│ Controllers              │
│ Services                 │
│ Data Access              │
│ Models / DTOs            │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       SQL SERVER         │
│                          │
│   DIARIO_PROYECTO_DB     │
└──────────────────────────┘
3. Tecnologías
Frontend

Se utilizará:

Vue 3
TypeScript
HTML5
CSS3
JavaScript a través de TypeScript.

Vue será responsable de la interfaz gráfica y de la interacción con los usuarios.

Backend

Se utilizará:

C#
ASP.NET Core Web API
API REST.

El backend será responsable de:

Recibir solicitudes del frontend.
Validar información.
Aplicar reglas de negocio.
Coordinar operaciones.
Consultar y modificar información.
Regresar respuestas al frontend.
Base de datos

Se utilizará:

Microsoft SQL Server

Base de datos:

DIARIO_PROYECTO_DB

El desarrollo de la base de datos deberá respetar la estructura definida en el documento de IHC.

No crear nuevas entidades o tablas sin una necesidad previamente justificada y autorizada.

4. Arquitectura por capas

La aplicación utilizará las siguientes capas:

PRESENTACIÓN
     ↓
API / CONTROLLERS
     ↓
LÓGICA DE NEGOCIO / SERVICES
     ↓
ACCESO A DATOS
     ↓
SQL SERVER
Capa de presentación

Está implementada con Vue 3 y TypeScript.

Contiene:

Pages / Views.
Components.
Formularios.
Tablas.
Navegación.
Validaciones básicas de interfaz.
Consumo de la API.

Esta capa no debe contener la lógica principal del negocio.

Capa de API / Controllers

Los Controllers estarán en ASP.NET Core.

Su responsabilidad es recibir solicitudes HTTP y devolver respuestas HTTP.

Ejemplo:

GET /api/prospectos
POST /api/prospectos
PUT /api/prospectos/{id}
GET /api/prospectos/{id}

El Controller no debe contener toda la lógica del sistema.

Debe delegar las operaciones al Service correspondiente.

Capa de lógica de negocio / Services

Los Services contienen la lógica del sistema.

Ejemplo:

ProspectoController
        ↓
ProspectoService
        ↓
Acceso a datos
        ↓
SQL Server

Esta capa será responsable de aplicar las reglas correspondientes a cada operación.

Por ejemplo:

Validar información.
Determinar cambios de estado.
Verificar relaciones.
Coordinar operaciones.
Procesar información antes de almacenarla.
Capa de acceso a datos

Esta capa será responsable de comunicarse con SQL Server.

Se puede utilizar:

Entity Framework Core

para realizar las operaciones habituales sobre las entidades.

Cuando sea conveniente para consultas específicas, reportes o procedimientos que requieran SQL, se podrá utilizar SQL Server directamente.

La lógica de negocio no deberá estar mezclada innecesariamente con las consultas SQL.

5. Estructura de la base de datos

La base de datos NO debe modificarse respecto a la estructura establecida en IHC, salvo que posteriormente exista una decisión explícita del equipo y del proyecto.

Actualmente contiene las siguientes tablas:

Empleados
Productos_Servicios
Prospectos
Paquetes_Tarifas
Contratos
Contrato_Detalles
Actividad_Log
6. Tabla Empleados

Representa a los usuarios internos que trabajan con el sistema.

Campos:

id_empleado
nombre
email
password_hash
rol
fecha_contratacion
activo

Roles permitidos actualmente:

Vendedor
Gerente
Administrador

El campo activo permitirá determinar si el empleado puede utilizar el sistema.

La contraseña nunca deberá almacenarse directamente. Debe utilizarse el campo password_hash para almacenar un hash seguro.

7. Tabla Productos_Servicios

Representa los servicios que ofrece la empresa.

Campos:

id_servicio
nombre_servicio

Es la entidad padre de los paquetes/tarifas.

Relación:

Productos_Servicios
        │
        │ 1:N
        ▼
Paquetes_Tarifas

Un servicio puede tener uno o varios paquetes o tarifas.

8. Tabla Prospectos

Esta tabla representa tanto a los prospectos como a los clientes.

Campos:

id_prospecto
nombre_empresa
nombre_contacto
cargo_contacto
telefono
email_contacto
pagina_web
domicilio
estado
id_empleado_registro
fecha_registro

El estado puede ser:

Prospecto
Cliente
Baja
Importante

No crear una tabla Clientes.

En este sistema, un registro de Prospectos se convierte en cliente mediante el campo:

estado = 'Cliente'

Por lo tanto:

PROSPECTO
   │
   │ proceso comercial concluido
   ▼
PROSPECTOS.estado = 'Cliente'

El nombre de la tabla se mantiene como Prospectos porque esa es la estructura definida en la base de datos original.

9. Tabla Paquetes_Tarifas

Representa los paquetes o tarifas disponibles para los servicios.

Campos:

id_paquete
id_servicio
pln
descripcion
medidas_ejemplos
tarifa_sin_iva

Cada paquete pertenece a un servicio.

Relación:

Productos_Servicios
        │
        │ 1:N
        ▼
Paquetes_Tarifas

Esta tabla permitirá manejar la información necesaria para los servicios que se ofrecen al cliente.

10. Tabla Contratos

Representa los contratos generados a partir del proceso comercial.

Campos:

id_contrato
id_prospecto
id_empleado_responsable
fecha_contrato
fecha_inicio_publicacion
fecha_fin_publicacion
observaciones
sub_total
iva_monto
total
estado

Estados permitidos:

Firmado
Vigente
Terminado
Cancelado

El contrato se relaciona con:

Prospectos
Empleados

Por lo tanto:

Prospecto
    │
    ▼
Contrato
    ▲
    │
Empleado responsable
11. Tabla Contrato_Detalles

Representa los paquetes incluidos dentro de un contrato.

Campos:

id_detalle
id_contrato
id_paquete
cantidad
precio_unitario
importe

Esta tabla es importante porque un contrato puede contener uno o varios paquetes.

La relación es:

Contrato
    │
    │ 1:N
    ▼
Contrato_Detalles
    │
    │ N:1
    ▼
Paquetes_Tarifas

Por ejemplo:

CONTRATO #25
│
├── Paquete periódico A
├── Paquete periódico B
└── Paquete radio C
12. Tabla Actividad_Log

Registra las actividades realizadas por los empleados.

Campos:

id_log
id_empleado
tipo_actividad
descripcion
fecha_hora

Esta tabla permitirá mantener un registro de actividades realizadas por los empleados.

Relación:

Empleado
    │
    │ 1:N
    ▼
Actividad_Log

El registro de actividades puede utilizarse como parte del seguimiento y del registro general del sistema.

13. Relaciones principales de la base de datos

El modelo general queda:

                  EMPLEADOS
                 /    |    \
                /     |     \
               ▼      ▼      ▼
        PROSPECTOS  CONTRATOS  ACTIVIDAD_LOG
            │          │
            │          │
            │          ▼
            │    CONTRATO_DETALLES
            │          │
            │          ▼
            │    PAQUETES_TARIFAS
            │          │
            │          ▼
            └──── PRODUCTOS_SERVICIOS

Más específicamente:

Empleados
   │
   ├──────────────► Prospectos
   │
   ├──────────────► Contratos
   │
   └──────────────► Actividad_Log

Productos_Servicios
   │
   └──────────────► Paquetes_Tarifas
                         │
                         ▼
                  Contrato_Detalles
                         ▲
                         │
                      Contratos
                         ▲
                         │
                    Prospectos
14. Módulos del sistema

Los módulos funcionales deben conservar los definidos en la propuesta original.

La implementación puede organizarse de la siguiente manera:

EL DIARIO
│
├── Autenticación
│
├── Prospectos
│
├── Clientes
│
├── Seguimiento
│
├── Periódico
│
├── Radio
│
├── Contratos
│
├── Registro General
│
├── Agenda
│
└── Administración
Importante sobre Clientes

Aunque exista un módulo llamado Clientes en la interfaz, este módulo no tendrá una tabla Clientes.

La información se obtiene de:

Prospectos
WHERE estado = 'Cliente'
15. Relación entre módulos y base de datos

La correspondencia será aproximadamente:

Módulo	Entidades principales
Autenticación	Empleados
Prospectos	Prospectos, Empleados
Clientes	Prospectos
Seguimiento	Prospectos, Actividad_Log, Empleados
Periódico	Productos_Servicios, Paquetes_Tarifas
Radio	Productos_Servicios, Paquetes_Tarifas
Contratos	Contratos, Contrato_Detalles, Prospectos, Empleados, Paquetes_Tarifas
Registro general	Actividad_Log, Prospectos, Contratos, Empleados
Agenda	Información relacionada con actividades y compromisos
Administración	Empleados, Productos_Servicios, Paquetes_Tarifas
16. Una aclaración importante sobre la base de datos

Hay módulos funcionales de la propuesta original que no tienen actualmente una tabla exclusiva en la base de datos.

Por ejemplo:

Agenda
Seguimiento
Cotización
Cancelación

Esto no significa que debamos inventar tablas automáticamente.

La implementación debe respetar primero la estructura de IHC.

En particular, la base de datos proporcionada no contiene actualmente una tabla Cotizaciones ni una tabla Cancelaciones.

Por lo tanto, Copilot no debe crear automáticamente esas tablas.

Si durante el desarrollo se determina que alguna funcionalidad requiere almacenamiento persistente que no puede representarse correctamente con el modelo actual, esa situación debe identificarse primero y discutirse antes de modificar la base de datos.

Esta regla es especialmente importante para evitar que el desarrollo termine creando una base de datos diferente a la que ya fue definida para el proyecto.

17. Frontend

La estructura propuesta para Vue será:

Frontend/
└── src/
    ├── components/
    ├── views/
    ├── services/
    ├── router/
    ├── types/
    ├── assets/
    └── App.vue
Views

Representan las páginas principales del sistema.

Por ejemplo:

views/
├── LoginView.vue
├── DashboardView.vue
├── ProspectosView.vue
├── ClientesView.vue
├── SeguimientoView.vue
├── ContratosView.vue
├── PeriodicoView.vue
├── RadioView.vue
├── RegistroGeneralView.vue
├── AgendaView.vue
└── AdministracionView.vue

Los nombres pueden adaptarse al prototipo de Figma.

18. Components

Los componentes serán elementos reutilizables de las páginas.

Por ejemplo:

components/
├── Navbar.vue
├── Sidebar.vue
├── DataTable.vue
├── SearchBar.vue
├── Modal.vue
├── ProspectoForm.vue
├── ClienteForm.vue
├── ContratoForm.vue
└── PaqueteCard.vue

No se deben crear componentes innecesariamente complejos.

Una View puede combinar varios componentes.

Ejemplo:

ProspectosView.vue
       │
       ├── SearchBar.vue
       ├── ProspectoTable.vue
       └── ProspectoForm.vue
19. Frontend Services

Los services del frontend serán responsables de comunicarse con la API.

Ejemplo:

services/
├── authService.ts
├── prospectoService.ts
├── clienteService.ts
├── contratoService.ts
├── paqueteService.ts
├── actividadService.ts
└── reporteService.ts

Ejemplo de flujo:

ProspectosView.vue
       ↓
prospectoService.ts
       ↓
GET /api/prospectos
       ↓
ProspectoController
20. Backend

La estructura inicial será:

Backend/
├── Controllers/
├── Services/
├── Data/
├── Models/
├── DTOs/
├── Repositories/
├── Migrations/
└── Program.cs
Controllers
Controllers/
├── AuthController.cs
├── EmpleadosController.cs
├── ProspectosController.cs
├── ServiciosController.cs
├── PaquetesController.cs
├── ContratosController.cs
└── ActividadesController.cs

No es necesario crear un Controller para cada elemento visual de la interfaz.

Los Controllers representan recursos y operaciones de la API, no necesariamente páginas.

21. Services del backend
Services/
├── AuthService.cs
├── EmpleadoService.cs
├── ProspectoService.cs
├── ServicioService.cs
├── PaqueteService.cs
├── ContratoService.cs
└── ActividadService.cs

Los Services contendrán las reglas de negocio.

Ejemplo:

ProspectosController
        ↓
ProspectoService
        ↓
ProspectoRepository
        ↓
SQL Server
22. DTOs

Se pueden utilizar DTOs para controlar qué información entra y sale de la API.

Por ejemplo:

DTOs/
├── LoginRequest.cs
├── ProspectoCreateDto.cs
├── ProspectoUpdateDto.cs
├── ProspectoResponseDto.cs
├── ContratoCreateDto.cs
└── ContratoResponseDto.cs

Esto evita exponer directamente todas las propiedades internas de las entidades de base de datos.

23. Modelos

Los modelos del backend deben representar las entidades existentes en SQL Server.

Por ejemplo:

Models/
├── Empleado.cs
├── ProductoServicio.cs
├── Prospecto.cs
├── PaqueteTarifa.cs
├── Contrato.cs
├── ContratoDetalle.cs
└── ActividadLog.cs

No crear:

Cliente.cs
Cotizacion.cs
Cancelacion.cs

automáticamente si no existen en la estructura de datos aprobada.

24. Entity Framework Core

Entity Framework Core será utilizado como herramienta de acceso a datos.

El DbContext tendrá las entidades correspondientes a las tablas reales:

Empleado
ProductoServicio
Prospecto
PaqueteTarifa
Contrato
ContratoDetalle
ActividadLog

Conceptualmente:

SQL Server
    ↕
Entity Framework Core
    ↕
Models
    ↕
Repositories / Services
25. API REST

Los endpoints deben seguir una estructura coherente.

Ejemplo:

/api/auth
/api/empleados
/api/prospectos
/api/servicios
/api/paquetes
/api/contratos
/api/actividades

Ejemplo de prospectos:

GET    /api/prospectos
GET    /api/prospectos/{id}
POST   /api/prospectos
PUT    /api/prospectos/{id}

Ejemplo de contratos:

GET    /api/contratos
GET    /api/contratos/{id}
POST   /api/contratos
PUT    /api/contratos/{id}

La API debe devolver información en formato JSON.

26. Flujo completo de una operación

El flujo técnico será:

┌─────────────┐
│   Usuario   │
└──────┬──────┘
       ▼
┌─────────────┐
│ Vue / View  │
└──────┬──────┘
       ▼
┌─────────────┐
│ Vue Service │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────┐
│ Controller  │
└──────┬──────┘
       ▼
┌─────────────┐
│   Service   │
└──────┬──────┘
       ▼
┌─────────────┐
│ Repository  │
│ / EF Core   │
└──────┬──────┘
       ▼
┌─────────────┐
│ SQL Server  │
└─────────────┘

La respuesta realiza el camino inverso.

27. Ejemplo: registrar un prospecto

El proceso técnico será:

Vendedor
   ↓
ProspectosView.vue
   ↓
ProspectoForm.vue
   ↓
prospectoService.ts
   ↓
POST /api/prospectos
   ↓
ProspectosController
   ↓
ProspectoService
   ↓
ProspectoRepository
   ↓
Entity Framework Core
   ↓
SQL Server
   ↓
Prospectos

Después SQL Server devuelve el resultado y este regresa hasta Vue.

28. Ejemplo: consultar clientes

No se consultará una tabla Clientes.

Se consultará:

SELECT *
FROM Prospectos
WHERE estado = 'Cliente';

Conceptualmente:

ClientesView
      ↓
clienteService
      ↓
GET /api/prospectos?estado=Cliente
      ↓
ProspectosController
      ↓
ProspectoService
      ↓
SQL Server
      ↓
Prospectos.estado = Cliente

Esto mantiene la implementación coherente con la base de datos existente.

29. Seguridad

El sistema tendrá autenticación para los empleados.

Los usuarios estarán representados por la tabla:

Empleados

La autenticación deberá utilizar el correo y una contraseña almacenada mediante hash.

El campo:

rol

determinará las funciones disponibles para cada usuario.

Los roles existentes son:

Vendedor
Gerente
Administrador

No deben agregarse nuevos roles sin autorización.