
# Nuxt, Sutando, Cloudflare Workers, and Cloudflare D1: The Stack

This repo only works in `pnpm run dev` mode (locally) due to some compatibility issues with Sutando, Knex, Rollup, Vite, and Nuxt.  If you'd like to purchase my work where I've figured this out, check out [activeflare.dev/pricing](https://activeflare.dev/pricing).

Deploying to production doesn't work in this repo.

## Installation

```
git clone github.com:activeflarets/preview.git activeflarets-preview
cd activeflarets-preview
brew install pnpm # or npm install -g pnpm
pnpm run init
```


## The stack
Key reference pages:
- [Nuxt JS v4.0.1](https://nuxt.com/docs/4.x/api) Fast, bells-included front-end development platform
    - [nuxt.config.ts](https://nuxt.com/docs/4.x/api/nuxt-config)
- [Nuxt UI v3.3.3](https://ui.nuxt.com/components#element): UI Components, interfaces, props, and bindings
- [Vite v7.0.6](https://vite.dev/): Build tool and the local dev environment tooling/server
     - in nuxt.config.ts
- [Nitro v2.12.4](https://nitro.build/config): Web server, routing for Cloudflare Workers 

### Frontend

#### Composition, Layout, and Logic
 * Nuxt/Vue
   - VueJS is easier (and less resource-consuming) than ReactJS
   - Nuxt is developer experience on top of Vue

### Backend
 * Cloudflare Workers
   - Serverless, fast, and cheap
 * Cloudflare [D1](https://developers.cloudflare.com/d1/) is a SQLite database that allows for super fast, replicated, and globally distributed data storage that scales to zero (no cost when not in use).
   - Roadmap: Sessions API

## Active Record Model
 * [Sutando](https://sutando.org/) is a typescript ORM on sqlite that implements the "[active record](https://en.wikipedia.org/wiki/Active_record_pattern#Single_responsibility_principle_and_separation_of_concerns)" model.
     * 1 typescript file per stored data, used by both frontend & backend with no changes.  
     * Sutando uses [Knex](https://knexjs.org/) (SQL Query Builder), which is battle-tested and connects directly to the sqlite file.
       * We can use this with D1 via the [knex-cloudflare-d1 plugin]


## Testing & Deploys

`pnpm run dev`

`pnpm run deploy` (this doesn't work here due to errors in a few different layers.  If you'd like to purchase my work where I've figured this out, check out [activeflare.dev/pricing](https://activeflare.dev/pricing)).


## Future notes
- https://daisyui.com/ might be interesting instead of Nuxt UI (but no SSR, which I don't plan on doing anyway)