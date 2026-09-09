'use strict';

const { Contract } = require('fabric-contract-api');

class RegistroContract extends Contract {

    _getTxTimestampISO(ctx) {
        const ts = ctx.stub.getTxTimestamp();
        const millis = ts.seconds.low * 1000 + Math.floor(ts.nanos / 1000000);
        return new Date(millis).toISOString();
    }

    async InitLedger(ctx) {
        const registros = [{ id: 'REG0', pulse: 72, temp: 36.5, oxygen: 76, desc: "Ejemplo de descripcion." },];

        for (const registro of registros) {
            registro.docType = 'registroMedico';
            await ctx.stub.putState(registro.id, Buffer.from(JSON.stringify(registro)));
        }
        return JSON.stringify({ message: 'Ledger inicializado correctamente' });
    }

    async CreateAsset(ctx, id, dataJson) {
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`El registro con id ${id} ya existe`);
        }

        let data;
        try {
            data = JSON.parse(dataJson);
        } catch (err) {
            throw new Error(`El JSON de datos es inválido: ${err.message}`);
        }

        const registro = {
            id,
            docType: 'registroMedico',
            pulse: data.pulse,
            temp: data.temp,
            oxygen: data.oxygen,
            desc: data.desc,
            hash: data.hash,
            createdAt: this._getTxTimestampISO(ctx),
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(registro)));
        ctx.stub.setEvent('CreateAsset', Buffer.from(JSON.stringify(registro)));

        return JSON.stringify(registro);
    }

    async GetAsset(ctx, id) {
        const registroBytes = await ctx.stub.getState(id);
        if (!registroBytes || registroBytes.length === 0) {
            throw new Error(`El registro con id ${id} no existe`);
        }
        return registroBytes.toString();
    }

    async AssetExists(ctx, id) {
        const registroBytes = await ctx.stub.getState(id);
        return registroBytes && registroBytes.length > 0;
    }

    async GetAllAssets(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');

        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        await iterator.close();

        return JSON.stringify(allResults);
    }

    async GetAssetHistory(ctx, id) {
        const iterator = await ctx.stub.getHistoryForKey(id);
        const historial = [];

        let result = await iterator.next();
        while (!result.done) {
            const entry = {
                txId: result.value.txId,
                timestamp: result.value.timestamp,
                isDelete: result.value.isDelete,
                value: result.value.value.length > 0
                    ? JSON.parse(result.value.value.toString('utf8'))
                    : null,
            };
            historial.push(entry);
            result = await iterator.next();
        }
        await iterator.close();

        return JSON.stringify(historial);
    }
}

module.exports = RegistroContract;
