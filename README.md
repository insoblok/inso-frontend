<h1 align="center">Inso Frontend</h1>

<p align="center">
    <span>Next-generation frontend for </span>
    <a href="https://github.com/insoblok/flatgas">Inso</a>
    <span> blockchain explorer (Flatgas protocol)</span>
</p>

## About

**Inso Frontend** is a fork of the [Blockscout frontend](https://github.com/blockscout/frontend), adapted for the Flatgas-based `inso` network. It serves as the UI layer for inspecting blocks, transactions, tokens, and addresses on the Inso chain.

This project is part of the broader [Flatgas protocol](https://github.com/insoblok/flatgas) initiative.

---

## Running the App

The app is distributed as a Docker image. You can configure and run it using your own `.env` file:

```sh
docker run -p 3000:3000 --env-file <path-to-your-env-file> ghcr.io/insoblok/inso-frontend:latest
```

You can also build your own Docker image for local customization. See our [custom build guide](./docs/CUSTOM_BUILD.md).

---

## Development with Nix

We support a Nix-based development environment for consistent builds.

1. Install [Nix](https://nixos.org/download).
2. Use the provided `shell.nix` to enter the dev environment:

```bash
nix-shell
```

3. Then install dependencies and run the app locally:

```bash
npm install
npm run dev
```

You may also want to use [direnv](https://direnv.net/) for automatic activation.

---

## Environment Configuration

You can configure the frontend using environment variables. See the full list and details in [docs/ENVS.md](./docs/ENVS.md).

---

## Resources
- [Flatgas Protocol](https://github.com/insoblok/flatgas)
- [Custom build instructions](./docs/CUSTOM_BUILD.md)
- [App ENVs list](./docs/ENVS.md)

## License

[![License: GPL v3.0](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Forked from Blockscout. This project remains under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
