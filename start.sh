#!/bin/bash

# =====================================================================
# Script de inicio unificado para macOS - Generador de CV ATS + IA
# =====================================================================

PHP_PORT=8000
PYTHON_PORT=8001
HOST="127.0.0.1"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC_DIR="$DIR/backend-php/public"
VENV_DIR="$DIR/microservice-python/venv"

echo "=========================================================="
echo "   🚀 Iniciando Generador de Currículums ATS de Clase Mundial"
echo "=========================================================="

# 1. Verificar PHP
if ! command -v php &> /dev/null; then
    echo "⚠️  PHP no fue encontrado en tu sistema."
    echo "   Instálalo con Homebrew: brew install php"
    exit 1
fi

PHP_VER=$(php -r "echo PHP_VERSION;")
echo "✅ PHP detectado: versión $PHP_VER"

# 2. Iniciar Microservicio Python (FastAPI + python-docx + IA)
echo "🐍 Iniciando Microservicio Python en http://$HOST:$PYTHON_PORT ..."
if [ -d "$VENV_DIR" ]; then
    PYTHON_CMD="$VENV_DIR/bin/python"
else
    PYTHON_CMD="python3"
fi

# Arrancar uvicorn en segundo plano
PYTHONPATH="$DIR/microservice-python" $PYTHON_CMD -m uvicorn app.main:app --host "$HOST" --port "$PYTHON_PORT" --app-dir "$DIR/microservice-python" &
PYTHON_PID=$!

# Capturar salida para detener ambos procesos con Ctrl+C
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $PYTHON_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

sleep 1

echo "✅ Microservicio Python (FastAPI & IA) activo (PID $PYTHON_PID)"
echo "🌐 Servidor Frontend PHP activo en: http://$HOST:$PHP_PORT"
echo ""
echo "   👉 Dashboard & Guía ATS: http://$HOST:$PHP_PORT/"
echo "   👉 Editor y Módulo IA:   http://$HOST:$PHP_PORT/cv/nuevo"
echo "   👉 Vista Previa A4:      http://$HOST:$PHP_PORT/cv/preview"
echo ""
echo "Presiona Ctrl + C para detener ambos servidores."
echo "=========================================================="

# Iniciar servidor integrado de PHP en primer plano
php -S "$HOST:$PHP_PORT" -t "$PUBLIC_DIR"
