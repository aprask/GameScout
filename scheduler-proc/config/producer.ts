import amqplib from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const HOST = process.env.RABBIT_HOST;
const PORT = process.env.RABBIT_PORT;
const USERNAME = process.env.RABBIT_USERNAME;
const PASSWORD = process.env.RABBIT_PASSWORD;

export class Producer {
    private channel!: amqplib.Channel;
    private connection!: Awaited<ReturnType<typeof amqplib.connect>>; // kinda complicated: basically we want the resolved promise of type connect, we are awaiting until it's resolved
    private queue: string;
    private message: string;
    private CONNECTION_URL = `amqp://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`;

    constructor(queue: string, message: string) {
        this.queue = queue;
        this.message = message;
    }

    public setMessage(msg: string) {
        this.message = msg;
    }

    private async waitForMQ(url: string): Promise<void> {
        const retries = 10;
        const delay = 50000;
        for (let i = 0; i < retries; ++i) {
            try {
                const connection = await amqplib.connect(url);
                await connection.close();
                console.log(`Connected to RabbitMQ on port ${PORT}`);
            } catch (err) {
                console.log(`Waiting for RabbitMQ: ${err}`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    public async producerConfig() {
        await this.waitForMQ(this.CONNECTION_URL);
        const connection = await amqplib.connect(this.CONNECTION_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(this.queue, {durable: true});
        channel.sendToQueue(this.queue, Buffer.from(this.message), { persistent: true });
    }

    public async shutDown() {
        await this.channel.close();
        await this.connection.close();
    }
}