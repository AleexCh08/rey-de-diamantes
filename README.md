# ♦️ Rey de Diamantes: Concurso de Belleza ♦️

## Descripción del Proyecto

Una aplicación web progresiva (PWA) de alta densidad visual que recrea el juego lógico "Concurso de Belleza". Diseñada bajo un enfoque *mobile-first*, la aplicación garantiza una experiencia inmersiva mediante una estricta gestión del estado, animaciones fluidas y un motor de audio centralizado.

## Stack Tecnológico

* **Framework Core:** React 18


* **Build Tool:** Vite


* **Estilos:** Tailwind CSS v4


* **Animaciones:** Framer Motion


* **PWA:** `vite-plugin-pwa` para instalación nativa y configuración de Service Workers.



## Arquitectura y Lógica Estructural

La aplicación fue construida separando estrictamente la lógica matemática de la capa de presentación (UI):

### 1. Gestión de Estado Central (`useGame.js`)

Toda la lógica del juego reside en un *custom hook*. Este controlador maestro maneja:

* **Ciclo de vida de la partida:** Transiciones de vistas entre configuración, turnos, resultados y pantallas de eliminación.


* **Motor Matemático:** Cálculo de promedios, determinación del objetivo exacto (80%), gestión de empates y aplicación penalizaciones de -1 o -2 PV.


* **Persistencia de Datos:** Guardado automático del estado general en `localStorage` (`cdb_save`) en cada cambio de vista crítico, permitiendo retomar partidas pausadas o abandonadas.



### 2. Capa de Presentación (`App.jsx`)

El punto de entrada actúa como un enrutador visual. Utiliza el componente `AnimatePresence` de la librería Framer Motion, junto con un envoltorio personalizado (`PageTransition`), para renderizar condicionalmente las distintas fases del juego sin recargar el DOM abruptamente.

### 3. Sistema de Interfaz de Alta Densidad (UI/UX)

La interfaz está diseñada para comportarse como una aplicación nativa estricta.

* **Contenedores Rígidos:** Uso extensivo de clases utilitarias como `h-dvh`, `overflow-hidden`, `flex-1`, `shrink-0` y `min-h-0` para bloquear el desplazamiento (*scroll*) general de la ventana y forzar a los elementos a comprimirse o expandirse orgánicamente dentro del espacio disponible.


* **Teclado Virtual Personalizado:** Implementación de un componente de entrada numérico y alfanumérico interno para evitar que el teclado nativo del sistema operativo del dispositivo empuje la interfaz y rompa la inmersión del jugador.



### 4. Motor de Audio y Retroalimentación Sensorial (`audio.js`)

* **Instanciación Única:** Los efectos de sonido se precargan y referencian en un objeto global de JavaScript (`audioInstances`) para evitar fugas de memoria o múltiples peticiones.


* **Control Global:** Funciones centralizadas (`playSound`, `stopSound`) y variables globales (`isSoundEnabled`) controlan el flujo auditivo respetando la configuración del usuario.


* **Haptic Feedback:** Uso de la API `navigator.vibrate` sincronizada con eventos críticos de la partida (como animaciones de eliminación de personajes) para otorgar respuesta táctil en dispositivos móviles.



### 5. Componentes Clave

* **`GameTransition.jsx`:** Encargado de las pantallas cinematográficas de bloqueo ("Sistema Listo", "Código Aceptado", y la geometría de "Pulso") usando retrasos de renderizado escalonados y sonidos temporalizados de alta tensión.


* **`GameButton.jsx`:** Componente de botón polimórfico con variantes visuales y respuestas de físicas con resortes virtuales (*springs*).



## Instalación y Ejecución Local

1. Clonar el repositorio.
2. Instalar las dependencias de Node:
```bash
npm install

```


3. Iniciar el servidor de desarrollo local:
```bash
npm run dev

```


4. Compilar la aplicación para entornos de producción:
```bash
npm run build

```



## Desarrollador

Arquitectura y código desarrollados por **AleexCh**.