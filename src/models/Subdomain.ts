
import db from '../database';
import { Model, DataTypes } from 'sequelize';

class Subdomain extends Model {
    declare id: number;
    declare subdomain: string;
    declare owner: string;
    declare pointedTo: string;
    declare recordType: "A" | "AAAA" | "CNAME" | "MX" | "NS" | "OPENPGPKEY" | "PTR" | "TXT" | "CAA" | "CERT" | "DNSKEY" | "DS" | "HTTPS" | "LOC" | "NAPTR" | "SMIMEA" | "SRV" | "SSHFP" | "SVCB" | "TLSA" | "URI";
    declare status: number;
    declare role: string;
    declare subdomainsCount: number;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

}

Subdomain.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    subdomain: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    owner: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    pointedTo: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    recordType: {
        type: DataTypes.ENUM("A", "AAAA", "CNAME", "MX", "NS", "OPENPGPKEY", "PTR", "TXT", "CAA", "CERT", "DNSKEY", "DS", "HTTPS", "LOC", "NAPTR", "SMIMEA", "SRV", "SSHFP", "SVCB", "TLSA", "URI"),
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'subdomains',
    sequelize: db,
});

Subdomain.sync()

export default Subdomain;