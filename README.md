# OverWave - Advanced Draft Builder para Wuthering Waves

**OverWave** é um aplicativo desktop avançado para gerenciar drafts de personagens em **Wuthering Waves**. Permite que você organize drafts de torneio com limite de pontos, visualize personagens com seus atributos, e gerencie banimentos e seleções de forma intuitiva.

## 🎮 Recursos Principais

- **Dois Modos de Draft**: Tournament Draft com limite de pontos e atributos
- **Interface Intuitiva**: Drag-and-drop para organizar sequências de ban/pick
- **Base de Dados Completa**: 60+ personagens (Resonators) com atributos (Aero, Electro, Fusion, Glacio, Havoc, Spectro)
- **Gerenciamento Visual**: Visualize banimentos, seleções e proprietários de picks
- **Aplicativo Desktop**: Construído com Electron para Windows
- **Instalador Automático**: Setup.exe para fácil instalação

## 📥 Instalação

### Opção 1: Instalador Automático (Recomendado)

1. Baixe o instalador mais recente em [Releases](https://github.com/Vitoaguiar/OverWave/releases)
2. Execute `OverWave-Setup.exe`
3. Siga o assistente de instalação
4. O aplicativo será instalado em `C:\Users\[YourUsername]\AppData\Local\Programs\OverWave`
5. Acesse via atalho no Menu Iniciar ou Desktop

### Opção 2: Desenvolvimento Local

**Pré-requisitos:**
- Node.js 16+ instalado
- Git instalado

**Passos:**

```powershell
# Clone o repositório
git clone https://github.com/Vitoaguiar/OverWave.git
cd OverWave

# Instale as dependências
npm install

# Inicie o modo desenvolvimento (janela Electron + live reload)
npm run dev

# Ou construa para produção
npm run build
npm start
```

## 🎯 Como Usar

### Modo Tournament Draft

1. **Abra o aplicativo** e selecione "Tournament Draft"

2. **Configure os Jogadores**:
   - Clique em cada campo de entrada para nomear os jogadores
   - Defina o limite de pontos (100 por padrão)
   - Escolha o número de picks por jogador

3. **Drag & Drop de Personagens**:
   - Clique e arraste um personagem da lista esquerda
   - Solte no slot de sequência (Pick Order) desejado
   - Badge automático mostra se é BAN ou PICK

4. **Gerenciar Sequência**:
   - **Remove (↺)**: Remove um personagem do slot
   - **Reset**: Limpa toda a sequência
   - **Swap**: Troca dois personagens de posição

5. **Visualização**:
   - Cada personagem mostra seu elemento (cor do ícone)
   - Badges indicam: BAN (vermelho), PICK (verde)
   - Exibe o proprietário (jogador) de cada seleção

### Modo Settings

- Ajuste configurações visuais
- Customize cores e layout
- Salve preferências

## 📊 Base de Dados

### Personagens (Resonators)

Os personagens estão definidos em `src/data/resonators.json`:

```json
{
  "id": "aalto",
  "name": "Aalto",
  "element": "Aero",
  "cost": 15,
  "icon": "./ResonatorsIcons/aalto.png"
}
```

**Elementos disponíveis:**
- 🌪️ **Aero** (Vento)
- ⚡ **Electro** (Elétrico)
- 🔥 **Fusion** (Fusão)
- ❄️ **Glacio** (Gelo)
- 💥 **Havoc** (Caos)
- 👁️ **Spectro** (Espectro)

### Armas (Weapons)

Definidas em `src/data/weapons.json` - possível expansão futura

### Definições de Decks

Definidas em `src/data/decks.json` - estruturas de draft pré-configuradas

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
OverWave/
├── src/
│   ├── App.jsx                 # Componente principal
│   ├── components/
│   │   └── TournamentDraft.jsx # Lógica do draft
│   ├── data/
│   │   ├── resonators.json    # Base de dados de personagens
│   │   ├── weapons.json       # Armas
│   │   └── decks.json         # Estruturas de draft
│   ├── styles/
│   │   └── tournamentDraft.css # Estilos
│   └── main.jsx               # Entry point React
├── electron/
│   ├── main.js                # Processo principal Electron
│   └── preload.cjs            # Bridge IPC segura
├── Icons/
│   ├── Attribute/             # Ícones de atributos
│   └── ResonatorsIcons/       # Ícones de personagens
├── package.json               # Dependências e scripts
├── vite.config.js             # Configuração Vite
├── tailwind.config.cjs        # Configuração Tailwind CSS
└── OverWave.iss              # Script Inno Setup (instalador)
```

### Scripts Disponíveis

```bash
npm run dev       # Inicia modo desenvolvimento (Electron + hot reload)
npm run build     # Compila otimizado para produção
npm run preview   # Preview da build de produção
npm start         # Inicia o app compilado
npm run dist      # Gera build otimizada + setup.exe
```

### Tecnologias

- **React 18.2.0** - UI library
- **Electron 41.4.0** - Framework desktop
- **Vite 8.0.10** - Build tool (rápido e moderno)
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **electron-builder** - Empacotador para Electron
- **Inno Setup** - Gerador de instalador Windows

## 🚀 Build & Distribuição

### Gerar Build de Produção

```powershell
npm run build    # Compila React com Vite
npm run start    # Testa a build compilada
```

### Gerar Instalador (.exe)

```powershell
npm run dist     # Compila tudo e gera OverWave-Setup.exe
```

O instalador será gerado em `dist/OverWave-Setup.exe` (~200MB compressed)

**Processo completo:**
1. Vite compila React em `dist/`
2. electron-builder empacota para `dist/win-unpacked/`
3. Inno Setup compila `OverWave.iss` → `OverWave-Setup.exe`

## 📝 Adicionar Novos Personagens

Para adicionar um novo Resonator:

1. **Adicione a imagem** em `Icons/ResonatorsIcons/[name].png`

2. **Atualize** `src/data/resonators.json`:

```json
{
  "id": "hiyuki",
  "name": "Hiyuki",
  "element": "Glacio",
  "cost": 24,
  "icon": "./ResonatorsIcons/hiyuki.png"
}
```

3. **Recompile:**
```powershell
npm run build    # Aplicativo
npm run dist     # Novo instalador
```

## 🤝 Contribuições

Contribuições são bem-vindas! Para sugerir melhorias:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📋 Requisitos Mínimos

- **Windows 7+**
- **256MB RAM livre** (recomendado 512MB+)
- **50MB espaço em disco**

## 🐛 Troubleshooting

### "Cannot find module..."
```powershell
npm install
```

### Imagens não carregam
- Certifique-se que os caminhos em `src/data/resonators.json` apontam para `./ResonatorsIcons/`

### Aplicativo não inicia
```powershell
npm run build
npm start
```

### Instalador não funciona
- Execute com privilégios de administrador
- Desinstale versões antigas primeiro

## 📦 Versão Atual

**v1.0.0** - Initial Release

### Changelog

- ✅ Tournament Draft Mode completo
- ✅ 60+ personagens com atributos
- ✅ Drag & drop funcional
- ✅ Interface com Tailwind CSS
- ✅ Instalador automático (Inno Setup)
- ✅ Suporte a Windows 7+

## 📄 Licença

Este projeto é de código aberto. Consulte o arquivo LICENSE para detalhes.

## 💬 Suporte

Encontrou um bug ou tem uma sugestão?
- Abra uma [Issue](https://github.com/Vitoaguiar/OverWave/issues)
- Compartilhe feedback no repositório

---

**Desenvolvido com ❤️ para a comunidade Wuthering Waves**

Versão: 1.0.0 | Última atualização: Maio 2026