[readme.md](https://github.com/user-attachments/files/21927114/readme.md)
# Calculadora Avanzada de Matrices

Una calculadora de matrices completa implementada en JavaScript puro, con interfaz web moderna y funcionalidades avanzadas de álgebra lineal.

## 🚀 Características

- **Operaciones Básicas**: Determinante, traza, rango, inversa y transpuesta
- **Análisis Avanzado**: Valores propios, verificación de propiedades (simetría, ortogonalidad)
- **Descomposiciones Matriciales**: LU, QR y Cholesky
- **Operaciones con Dos Matrices**: Suma, resta, multiplicación y conmutador
- **Sistemas Lineales**: Resolución de sistemas Ax = b mediante LU y Regla de Cramer
- **Exportación a LaTeX**: Copia matrices en formato LaTeX para usar con chatbots LLM
- **Interfaz Responsiva**: Diseño moderno que se adapta a diferentes dispositivos
- **Sin Dependencias**: JavaScript puro sin bibliotecas externas

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos con Grid, Flexbox y efectos visuales
- **JavaScript ES6+**: Lógica de la aplicación y cálculos matriciales
- **Gradientes CSS**: Diseño visual atractivo
- **MathJax/LaTeX**: Exportación de notación matemática

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/calculadora-matrices.git
```

2. Navega al directorio del proyecto:
```bash
cd calculadora-matrices
```

3. Abre el archivo `index.html` en tu navegador:
```bash
# Opción 1: Doble clic en el archivo
# Opción 2: Usa un servidor local (recomendado)
python -m http.server 8000
# Luego visita http://localhost:8000
```

## 🎮 Uso

### Operaciones Básicas
1. Selecciona el tamaño de la matriz
2. Ingresa los valores o usa los botones de llenado automático
3. Elige la operación deseada (determinante, traza, etc.)

### Operaciones con Dos Matrices
1. Ve a la pestaña "Operaciones Duales"
2. Genera y completa ambas matrices
3. Selecciona la operación a realizar

### Sistemas Lineales
1. Ve a la pestaña "Sistemas Lineales"
2. Completa la matriz de coeficientes y el vector b
3. Resuelve usando LU o Regla de Cramer

### Exportación a LaTeX
Usa los botones "📋 Copiar LaTeX" en cada sección para exportar matrices y vectores en formato compatible con chatbots.

## 📁 Estructura del Proyecto

```
calculadora-matrices/
├── index.html          # Estructura principal de la aplicación
├── styles.css          # Estilos y diseño responsive
├── script.js           # Lógica de la aplicación y cálculos
└── README.md           # Este archivo
```

## 🔢 Funcionalidades Matemáticas Implementadas

- Cálculo de determinante (via LU)
- Cálculo de traza y rango
- Inversión de matrices (Gauss-Jordan)
- Transposición
- Valores y vectores propios (Jacobi para matrices simétricas)
- Descomposición LU, QR y Cholesky
- Operaciones binarias entre matrices
- Resolución de sistemas lineales
- Verificación de propiedades matriciales

## 🌐 Compatibilidad

- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Dispositivos móviles y tablets
- Soporte para touch events

## 🤝 Contribución

Las contribuciones son bienvenidas. Para cambios importantes:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación anterior
2. Busca en los issues existentes
3. Abre un nuevo issue con detalles del problema

## 🔮 Roadmap

- [ ] Implementar descomposición SVD
- [ ] Añadir más métodos iterativos
- [ ] Soporte para matrices complejas
- [ ] Historial de operaciones
- [ ] Exportación/importación de matrices
- [ ] Modo tutorial paso a paso

---

¿Te gusta este proyecto? ¡Dale una estrella ⭐ en GitHub!
