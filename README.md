# ITP Works

A URL shortener that runs on Cloudflare Workers. It stores the rules in Cloudflare KV storage and sends a 301 redirect when a matched pathname is request.

[Visit itp.works](https://itp.works/)

## Deploy

To get started, Install the cloudflare wrangler & login

```shell
npm install -g @cloudflare/wrangler
wrangler login
```

Clone this repo & configure for deployment

```shell
git clone https://github.com/jasongao97/itp-works.git
mv wrangler.toml.example wrangler.toml
```

Develop or Publish

```shell
wrangler dev # Develop
wrangler publish # Publish
```
