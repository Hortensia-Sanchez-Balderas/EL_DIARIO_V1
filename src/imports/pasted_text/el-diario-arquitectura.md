Actualiza la arquitectura de desarrollo del sistema web “EL DIARIO”, correspondiente al sistema de gestión del proceso de ventas de Grupo Multimedia “El Diario de Coahuila”.

IMPORTANTE:
- No modificar el proceso de negocio existente.
- No modificar los módulos, funcionalidades, roles, información o flujo de trabajo ya definidos en el proyecto.
- Mantener la estructura y lógica del prototipo actual.
- Los cambios solicitados son únicamente de arquitectura tecnológica y organización del desarrollo.
- No agregar funcionalidades que no estén contempladas en el proyecto.
- Mantener el sistema sencillo y viable para un proyecto académico.

NUEVA ARQUITECTURA DE DESARROLLO:

El sistema utilizará una arquitectura web ligera basada en un enfoque BaaS (Backend as a Service) mediante Supabase, evitando desarrollar un backend independiente con ASP.NET, C# o una API REST propia.

Todo el proyecto deberá mantenerse dentro de un solo repositorio/proyecto, integrando frontend, lógica de aplicación y configuración de Supabase.

TECNOLOGÍAS:

Frontend:
- Vue 3
- TypeScript
- HTML5
- CSS3
- Vite
- Vue Router
- Pinia únicamente si resulta necesario para manejar estados globales.

Backend / Servicios:
- Supabase
- Supabase JavaScript SDK
- Supabase Auth para autenticación.
- Supabase Database para acceso a los datos.
- Row Level Security (RLS) para seguridad y control de acceso.

Base de datos:
- PostgreSQL, utilizando la base de datos proporcionada por Supabase.
- Mantener como referencia conceptual las entidades ya definidas para el sistema:
  - Empleados
  - Productos_Servicios
  - Prospectos
  - Paquetes_Tarifas
  - Contratos
  - Contrato_Detalles
  - Actividad_Log

No crear una base de datos independiente para IHC. IHC es únicamente la materia y el documento de referencia donde se definieron el proceso y el prototipo. La base de datos corresponde al proyecto “EL DIARIO”.

ORGANIZACIÓN POR CAPAS:

Aunque Supabase proporciona directamente los servicios de backend y base de datos, organizar conceptualmente el proyecto en las siguientes capas:

1. CAPA DE PRESENTACIÓN
Responsable de la interfaz que utiliza el usuario.
Tecnologías:
- Vue 3
- TypeScript
- HTML5
- CSS3
- Vue Router

Aquí se encuentran las páginas, vistas, componentes, formularios, tablas, navegación y elementos visuales del sistema.

2. CAPA DE SERVICIOS Y LÓGICA
Responsable de conectar la interfaz con Supabase y centralizar la lógica necesaria del sistema.

Utilizar archivos o módulos de servicios para operaciones como:
- Autenticación.
- Consulta de prospectos y clientes.
- Registro y modificación de información.
- Consulta de productos y servicios.
- Gestión de paquetes y tarifas.
- Gestión de contratos.
- Registro de actividades.
- Consultas para el dashboard y registro general.

La interfaz no deberá contener directamente todas las consultas a la base de datos; utilizar servicios para mantener el código organizado.

3. CAPA DE DATOS Y SEGURIDAD
Será proporcionada principalmente por Supabase.

Responsabilidades:
- PostgreSQL para almacenar la información.
- Supabase Auth para autenticación.
- Row Level Security (RLS) para controlar el acceso a los datos.
- Relaciones entre las tablas.
- Restricciones y validaciones de datos.

No desarrollar un servidor backend independiente.

ESTRUCTURA GENERAL DEL PROYECTO:

Organizar el proyecto de manera sencilla dentro de un único repositorio, por ejemplo:

EL-DIARIO/
├── src/
│   ├── components/
│   ├── views/
│   ├── router/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── assets/
├── supabase/
│   └── migrations/
├── public/
├── package.json
└── configuración de Vite y TypeScript

No es necesario crear carpetas de backend tradicional, controladores de C#, modelos de ASP.NET o una API REST independiente.

MÓDULOS QUE DEBE CONSERVAR EL SISTEMA:

- Inicio de sesión
- Dashboard
- Prospectos
- Clientes
- Seguimiento
- Periódico
- Radio
- Contratos
- Registro general
- Agenda
- Administración

ROLES DEL SISTEMA:

Mantener los roles definidos para el funcionamiento del sistema:
- Vendedor
- Administrador

El cliente debe mantenerse como parte del proceso comercial y como información registrada dentro del sistema, no como un usuario operativo con inicio de sesión, a menos que el prototipo actual ya indique explícitamente lo contrario.

OBJETIVO DEL CAMBIO:

La arquitectura debe representar un sistema sencillo de desarrollar, mantener y desplegar. Supabase funcionará como la plataforma de servicios de backend y base de datos, mientras Vue 3 y TypeScript manejarán la interfaz y la lógica de interacción.

El resultado debe conservar la funcionalidad y apariencia general del prototipo existente, pero adaptar internamente la organización del proyecto a esta nueva arquitectura.

NO utilizar como arquitectura actual:
- ASP.NET Core
- C#
- Entity Framework
- SQL Server
- Backend separado
- API REST propia
- Microservicios

La arquitectura final debe ser:
Vue 3 + TypeScript + Vite
        ↓
Capa de presentación
        ↓
Capa de servicios y lógica
        ↓
Supabase
        ↓
PostgreSQL + Auth + RLS

Representar esta arquitectura de manera clara, sencilla y profesional dentro del proyecto, sin agregar complejidad innecesaria.