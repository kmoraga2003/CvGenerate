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

# 1. Liberar puertos si quedaron procesos previos colgados
OLD_PY=$(lsof -t -i :$PYTHON_PORT 2>/dev/null)
if [ -n "$OLD_PY" ]; then kill -9 $OLD_PY 2>/dev/null || true; fi

OLD_PHP=$(lsof -t -i :$PHP_PORT 2>/dev/null)
if [ -n "$OLD_PHP" ]; then kill -9 $OLD_PHP 2>/dev/null || true; fi

# 2. Verificar PHP
if ! command -v php &> /dev/null; then
    echo "⚠️  PHP no fue encontrado en tu sistema."
    echo "   Instálalo con Homebrew: brew install php"
    exit 1
fi

PHP_VER=$(php -r "echo PHP_VERSION;")
echo "✅ PHP detectado: versión $PHP_VER"

# 3. Iniciar Microservicio Python (FastAPI + python-docx + IA)
echo "🐍 Levantando Microservicio Python en http://$HOST:$PYTHON_PORT ..."
if [ -f "$VENV_DIR/bin/python" ]; then
    PYTHON_CMD="$VENV_DIR/bin/python"
else
    PYTHON_CMD="python3"
fi

# Arrancar uvicorn entrecomillando el comando para soportar espacios en la ruta
PYTHONPATH="$DIR/microservice-python" "$PYTHON_CMD" -m uvicorn app.main:app --host "$HOST" --port "$PYTHON_PORT" --app-dir "$DIR/microservice-python" &
PYTHON_PID=$!

# Asegurar cierre de ambos servidores con Ctrl+C
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $PYTHON_PID 2>/dev/null || true
    P1=$(lsof -t -i :$PYTHON_PORT 2>/dev/null)
    if [ -n "$P1" ]; then kill -9 $P1 2>/dev/null || true; fi
    P2=$(lsof -t -i :$PHP_PORT 2>/dev/null)
    if [ -n "$P2" ]; then kill -9 $P2 2>/dev/null || true; fi
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Esperar 2 segundos a que FastAPI inicialice
sleep 2

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
