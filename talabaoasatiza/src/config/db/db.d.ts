import mongoose from 'mongoose';
interface MongooseGlobal {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose | null> | null;
}
declare global {
    var mongoose: MongooseGlobal;
}
declare function connectToDatabase(): Promise<typeof mongoose | null>;
export default connectToDatabase;
//# sourceMappingURL=db.d.ts.map