import amqplib from 'amqplib';
import { ConsumeMessage } from 'amqplib';
import { bulkGameInsert } from '../service/game.js';
import { GameMessage } from '../data/models/models.js';

const HOST = process.env.RABBIT_HOST;
const PORT = process.env.RABBIT_PORT;
const USERNAME = process.env.RABBIT_USERNAME;
const PASSWORD = process.env.RABBIT_PASSWORD;

export class Consumer {
    private channel!: amqplib.Channel;
    private connection!: Awaited<ReturnType<typeof amqplib.connect>>; // kinda complicated: basically we want the resolved promise of type connect, we are awaiting until it's resolved
    private queue: string;
    private CONNECTION_URL = `amqp://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`;

    constructor(queue: string) {
        this.queue = queue;
    }

    private async waitForMQ(url: string): Promise<void> {
        const retries = 10;
        const delay = 10000;
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

    public async consumerConfig() {
        await this.waitForMQ(this.CONNECTION_URL);
        console.log("HERE");
        this.connection = await amqplib.connect(this.CONNECTION_URL);
        this.channel = await this.connection.createChannel();
        this.channel.assertQueue(this.queue, {durable: true}); // durable makes sure messages aren't lost
        console.log("queue: ", this.queue);
        this.channel.consume(this.queue, async (message: ConsumeMessage | null) => {
            console.log(`Message ${message}`);
            if (message !== null) {
                await bulkGameInsert(JSON.parse(message.content.toString()) as GameMessage[]);
                this.channel.ack(message);
            } else {
                console.log("Not received a message");
                return;
            };
        },
        {
            noAck: false
        });
    }

    public async shutDown() {
        await this.channel.close();
        await this.connection.close();
    }
}
