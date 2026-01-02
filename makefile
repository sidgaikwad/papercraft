.PHONY: install build test dev clean

install:
	bun install

build:
	bun run build

test:
	bun test

dev:
	bun --watch examples/basic.ts

clean:
	rm -rf dist node_modules *.pdf output-*.pdf

example-basic:
	bun run examples/basic.ts

example-advanced:
	bun run examples/advanced.ts

example-invoice:
	bun run examples/invoice.ts

lint:
	bun run lint:fix

format:
	bun run format
