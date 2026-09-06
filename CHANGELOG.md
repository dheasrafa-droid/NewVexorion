# Changelog

All notable changes to the NewVexorion project will be documented in this file.

## [2.1.0] - 2026-09-06
### Added
- AssetLoader and AssetProcessor supporting multi-format asset parsing (CSV, JSON, XML, HTML, TXT, MD, LOG, YAML).
- Three.js inspired `Attribute` and `AttributeManager` reactive state system with dirty checks.
- Event-driven architecture with `EventDispatcher`.
- DataTransformer and DataAggregator statistical helpers.
- Full test suite in `test/test-full.js`.

## [2.0.0] - 2026-09-05
### Added
- `DataProcessorEnhanced` facade coordinating I/O, parsing, validation, and export.
- Support for CSV parsing, filtering, and multi-format export (CSV, JSON, HTML).
- Interactive web viewer interfaces (`web/index.html` and `web/index-enhanced.html`).

## [1.0.0] - 2026-09-01
### Added
- Initial release with `FileReader`, `FileWriter`, and `DataProcessor`.
