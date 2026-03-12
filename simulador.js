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
    <div class="flex items-stretch">
        <h3>Resultado</h3>
        <div class="m-1 border rounded-sm bg-white">
            <h4>Previo al adelanto</h4>
        </div>
        <div class="m-1 border rounded-sm bg-white">
            <h4>Adelanto</h4>
            Capital precancelado: ${resultado.capitalReducido.toFixed(2)} UVA <br><br>
            Costo por precancelación (3%): ${resultado.costoPrecancelacion.toFixed(2)} UVA <br>
            Total que debés pagar al banco: <b>${resultado.totalAPagar.toFixed(2)} UVA</b> <br><br>
            Interés restante sin prepago: ${resultado.interesNormal.toFixed(2)} UVA <br>
            Interés restante con prepago: ${resultado.interesConPrepago.toFixed(2)} UVA <br><br>
            Ahorro de intereses: <b>${resultado.interesAhorrado.toFixed(2)} UVA</b> <br><br>
            Cuotas eliminadas: ${resultado.cuotasAhorradas}
        </div>
        <div class="m-1 border rounded-sm bg-white">
            <h4>Luego del adelanto</h4>
            <label>Saldo de capital (UVA):</label><br>
            <label>Saldo de capital (Pesos):</label><br>
            <label>Saldo de capital (Dólares):</label><br>
            <label>Saldo de interés (UVA):</label><br>
            <label>Saldo de interés (Pesos):</label><br>
            <label>Saldo de interés (Dólares):</label><br>
            <label>Saldo de cuotas (UVA):</label><br>
            <label>Saldo de cuotas (Pesos):</label><br>
            <label>Saldo de cuotas (Dólares):</label><br>
        </div>
    </div>
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
    const ultimo = data[data.length - 1];

    return {
        valor: ultimo.valor,
        fecha: ultimo.fecha
    }
}


async function cargarIndicadores() {

    try {

        const dolar = await obtenerDolarOficial();
        const uva = await obtenerUVA();

        document.getElementById("dolar-oficial").innerText = dolar.toFixed(2);
        document.getElementById("uva").innerText = uva.valor.toFixed(2);

        const fechaFormateada = new Date(uva.fecha).toLocaleDateString("es-AR");

        document.getElementById("uva-fecha").innerText = fechaFormateada;

    } catch (error) {

        console.error("Error cargando indicadores:", error);

    }
}
cargarIndicadores();