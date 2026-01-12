export interface PathTransformerInterface {
  execute(data: Record<string, unknown>): Record<string, unknown>;
}
