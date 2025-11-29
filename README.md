# ⏳ MeFalta ⏳

<img width="1062" height="1774" alt="mefalta" src="https://github.com/user-attachments/assets/278635b6-f09f-4348-9c21-36c8e47b19c1" />

**MeFalta** es una aplicación web que diseñé para calcular el tiempo que me falta para terminar un curso que estoy haciendo. A diferencia de los contadores tradicionales, MeFalta tiene en cuenta solo las horas del curso reales, excluyendo fines de semana, festivos y días libres personalizados. Por día cuenta 5 horas.

## Características principales

*   **Cálculo de tiempo**: Cada día laborable cuenta como **5 horas** de trabajo efectivo.
*   **Exclusión inteligente de días**:
    *   🚫 **Fines de semana**: Sábados y domingos se excluyen automáticamente.
    *   🎉 **Festivos nacionales**: Incluye el calendario de festivos de España para 2024, 2025 y 2026.
    *   🖱️ **Exclusiones manuales**: Haz clic en cualquier día del calendario para excluirlo (vacaciones, asuntos propios, etc.).
*   **Calendario interactivo**:
    *   Visualiza todo el rango de fechas.
    *   **Código de colores**:
        *   🟢 **Verde**: Día laborable.
        *   ⚪ **Gris**: Fin de semana.
        *   🌸 **Rosa**: Festivo.
        *   🔴 **Rojo**: Día excluido manualmente.
    *   **Interacción**: Haz clic en los días para cambiar su estado cíclicamente.
*   **Persistencia de datos**: Tu configuración se guarda automáticamente en el navegador. Si cierras la pestaña, al volver todo estará igual.
*   **Diseño**: Interfaz moderna con modo oscuro, efectos de cristal (glassmorphism) y animaciones suaves.

## Tecnologías utilizadas

*   **HTML5**: Estructura semántica.
*   **CSS3**: Variables, Grid/Flexbox, animaciones y diseño responsivo.
*   **JavaScript (Vanilla)**: Lógica de cálculo de fechas, manipulación del DOM y persistencia con LocalStorage.

## Cómo usar

1.  **Configura las fechas**:
    *   Selecciona la **fecha de inicio** (Las deben de ir desde las 09:00 a las 14:00).
    *   Selecciona la **fecha de fin** (Las deben de ir desde las 09:00 a las 14:00).
2.  **Inicia el contador**: Pulsa el botón "Iniciar cuenta regresiva".
3.  **Personaliza**:
    *   Si tienes días libres o vacaciones, haz clic sobre esos días en el calendario para marcarlos en **Rojo** (Excluido).
    *   El contador se recalculará automáticamente.
4.  **Guarda**: No necesitas hacer nada, se guarda solo.
5.  **Reiniciar**: Si quieres empezar de cero, pulsa el botón "Limpiar Datos" (icono de papelera).

## 📂 Estructura del proyecto

*   `index.html`: Estructura de la página.
*   `styles.css`: Estilos y diseño visual.
*   `script.js`: Lógica de la aplicación.

---
*Desarrollado para ver la luz al final del curso .... por entreunosyceros.net*
