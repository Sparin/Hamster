import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserToGame } from "./UserToGame";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    public discordId!: string;

    @Column()
    public name!: string;

    @OneToMany((type) => UserToGame, (userToGame) => userToGame.user)
    public userToGames!: UserToGame[];

}