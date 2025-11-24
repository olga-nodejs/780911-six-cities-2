export default interface DBClient {
  connect(url: string): Promise<void>;
  disconnect(): Promise<void>;
}
