import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserToGame } from "./UserToGame";

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    public name!: string;

    @OneToMany((type) => UserToGame, (userToGame) => userToGame.game)
    public userToGames!: UserToGame[];
}