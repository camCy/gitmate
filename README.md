# GitMate

Generador de mensajes de commit con IA usando Groq. Genera mensajes descriptivos siguiendo la convencion de [Conventional Commits](https://www.conventionalcommits.org/).

## Requisitos previos

- Node.js >= 18
- Una API key de [Groq Cloud](https://console.groq.com/keys)

## Instalacion

### Desde npm (recomendado)

```bash
npm install -g gitmate
```

### Desde codigo fuente

```bash
git clone https://github.com/tu-usuario/gitmate.git
cd gitmate
npm install
npm run build
npm link
```

## Configuracion

1. Crea un archivo `.env` en la raiz del proyecto (o copia el ejemplo):

```bash
cp .env.example .env
```

2. Agrega tu API key de Groq:

```
GROQ_API_KEY=gsk_xxxxx
```

Para obtener una API key, Registrate en [console.groq.com](https://console.groq.com/keys).

## Uso

### Comando generate

Genera un mensaje de commit basado en los cambios staged:

```bash
git add .
gitmate generate
```

**Opciones:**

| Opcion | Descripcion | Valor por defecto |
|--------|-------------|-------------------|
| `-m, --model <model>` | Modelo Groq a usar | `llama-3.3-70b-versatile` |
| `-t, --max-tokens <number>` | Maximo de tokens en respuesta | `300` |
| `--temperature <number>` | Temperatura del modelo (0-1) | `0.3` |

**Modelos disponibles:** `llama-3.3-70b-versatile`, `mixtral-8x7b-32768`, `llama-3.1-8b-instant`

### Git Hook (automatico)

Instala un hook que genera automaticamente el mensaje cuando ejecutas `git commit`:

```bash
gitmate hook install
```

**Comandos del hook:**

```bash
gitmate hook install   # Instala el hook prepare-commit-msg
gitmate hook uninstall # Desinstala el hook
gitmate hook status    # Muestra si el hook esta instalado
```

## Ejemplos

**Uso basico:**

```bash
# Hacer cambios en archivos...
git add .

# Generar mensaje de commit
gitmate generate
# Output:
# Mensaje de commit generado:
#
# feat: agregar validacion de email
#
#   - Anadir regex de validacion en utils
#   - Integrar con el formulario de registro
#   - Agregar tests para casos validos e invalidos
```

**Usar un modelo diferente:**

```bash
gitmate generate -m llama-3.1-8b-instant
```

**Modo hook (para commits automaticos):**

```bash
gitmate hook install
git add .
git commit
# El hook genera el mensaje automaticamente
```