import { Entity, Column, ManyToOne, RelationId, PrimaryColumn } from "typeorm";
import { Game } from "./Game";
import { User } from "./User";

@Entity()
export class UserToGame {
    @PrimaryColumn()
    @RelationId((u2g: UserToGame) => u2g.user)
    public userId!: number;

    @PrimaryColumn()
    @RelationId((u2g: UserToGame) => u2g.game)
    public gameId!: number;

    @Column()
    public lastSeen!: number;

    @ManyToOne(type => Game, game => game.userToGames)
    public game!: Game;

    @ManyToOne(type => User, user => user.userToGames)
    public user!: User;
}