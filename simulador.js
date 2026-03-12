function simularCredito(saldo, tasaAnual, cuota) {

    const tasaMensual = tasaAnual / 12 / 100;

    let interesTotal = 0;
    let cuotas = 0;

    while (saldo > 0) {

        let interes = saldo * tasaMensual;
        let capital = cuota - interes;

        saldo -= capital;

        interesTotal += interes;
        cuotas++;

        // evitar errores de redondeo
        if (cuotas > 1000) break;
    }

    return {
        interesTotal: interesTotal,
        cuotas: cuotas
    };
}


function calcularPrepago(saldo, tasa, cuota, prepago) {

    const escenarioNormal = simularCredito(saldo, tasa, cuota);

    const saldoNuevo = saldo - prepago;

    const escenarioPrepago = simularCredito(saldoNuevo, tasa, cuota);

    const ahorroIntereses = escenarioNormal.interesTotal - escenarioPrepago.interesTotal;

    const cuotasAhorradas = escenarioNormal.cuotas - escenarioPrepago.cuotas;

    const costoPrecanc = prepago * 0.03;
    const totalPago = prepago + costoPrecanc;

    return {
        capitalReducido: prepago,
        interesNormal: escenarioNormal.interesTotal,
        interesConPrepago: escenarioPrepago.interesTotal,
        interesAhorrado: ahorroIntereses,
        cuotasAhorradas: cuotasAhorradas,
        costoPrecancelacion: costoPrecanc,
        totalAPagar: totalPago
    };
}


function simular() {

    const saldo = parseFloat(document.getElementById("saldo").value);
    const tasa = parseFloat(document.getElementById("tasa").value);
    const cuota = parseFloat(document.getElementById("cuota").value);
    const prepago = parseFloat(document.getElementById("prepago").value);

    const resultado = calcularPrepago(saldo, tasa, cuota, prepago);

    document.getElementById("resultado").innerHTML = `

        Capital precancelado: ${resultado.capitalReducido.toFixed(2)} UVA <br><br>

        Costo por precancelación (3%): ${resultado.costoPrecancelacion.toFixed(2)} UVA <br>
        Total que debés pagar al banco: <b>${resultado.totalAPagar.toFixed(2)} UVA</b> <br><br>

        Interés restante sin prepago: ${resultado.interesNormal.toFixed(2)} UVA <br>
        Interés restante con prepago: ${resultado.interesConPrepago.toFixed(2)} UVA <br><br>

        Ahorro de intereses: <b>${resultado.interesAhorrado.toFixed(2)} UVA</b> <br><br>

        Cuotas eliminadas: ${resultado.cuotasAhorradas}

`;
}

async function obtenerDolarOficial() {

    const response = await fetch("https://dolarapi.com/v1/dolares/oficial");
    const data = await response.json();

    return data.venta;

}

async function obtenerUVA() {

    const response = await fetch("https://api.argentinadatos.com/v1/finanzas/indices/uva");

    const data = await response.json();

    return data.valor;

}


async function cargarIndicadores() {

    try {

        const dolar = await obtenerDolarOficial();
        const uva = await obtenerUVA();
        document.getElementById("dolar-oficial").innerText = dolar.toFixed(2);
        document.getElementById("uva").innerText = uva.toFixed(2);

    } catch (error) {

        console.error("Error cargando indicadores:", error);
        document.getElementById("dolar-oficial").innerText = "error";
        document.getElementById("uva").innerText = "error";

    }
}

cargarIndicadores();