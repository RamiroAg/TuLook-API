# TuLook-API
_API que implementa ABM, soportando GET, POST, PUT, DELETE, sobre las siguientes cuatro entidades:_
 - _peluqueria_
 - _usuario_
 - _turno_
 - _review_
 
 ## Nuevos Endpoints
  - _peluquerias/{id} - GET_
  - _usuarios/{id} - GET_
  - _reviews/{id} - GET_
  - _reviews/byPeluqueria/{peluqueriaId} - GET_
  - _turnos/{id} - GET_
  - _turnos/byPeluqueria/{peluqueriaId} - GET_
  - _turnos/byUsuario/{peluqueriaId} - GET_
## Ejecutar la solución 🚀
Iniciar una consola dentro de la carpeta de la solción y ejecutar:
```
npm run dev
```

## Estructura de datos
La solución maneja la persistencia de datos en archivos .json
Estructuras de datos usadas para generar los mocks:
https://www.mockaroo.com/projects/25412
