import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./Game";
import { User } from "./User";

@Entity()
export class UserToGame {
    @PrimaryGeneratedColumn()
    public id!: number;

    public userId!: number;
    public gameId!: number;

    @Column()
    public lastSeen!: Date;

    @ManyToOne(type => Game, game => game.userToGames)
    public game!: Game;

    @ManyToOne(type => User, user => user.userToGames)
    public user!: User;
}