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

    let costoPrecanc = 0;

    if (prepago < saldo) {
        costoPrecanc = prepago * 0.03;
    }

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
    const escenarioNormal = simularCredito(saldo, tasa, cuota);
    const resultado = calcularPrepago(saldo, tasa, cuota, prepago);
    const totalCuotas = parseInt(document.getElementById("totalCuotas").value);
    const cuotasPagadas = parseInt(document.getElementById("cuotasPagadas").value);

    const cuotasRestantes = totalCuotas - cuotasPagadas;

    escenarioNormal.cuotas = Math.min(escenarioNormal.cuotas, cuotasRestantes);

    document.getElementById("resultado").innerHTML = `
    <div class="flex flex-col items-stretch">
        <div class="text-center">    
            <h3><b>Resultado</b></h3>
        </div>
        <div class="flex flex-col lg:flex-row">
            <div class="p-1 m-1 border rounded-sm bg-[#f4cccc]">
                <h4><b>Previo al adelanto</b></h4>
                <b>Capital (UVA):</b><br>
                <hr>
                <b>Capital (Pesos):</b><br>
                <hr>
                <b>Capital (Dólares):</b><br>
                <hr>
                <b>Intereses (UVA):</b><br>
                <hr>
                <b>Intereses (Pesos):</b><br>
                <hr>
                <b>Intereses (Dólares):</b><br>
                <hr>
                <b>Cuotas restantes:</b><br>
            </div>
            <div class="p-1 m-1 border rounded-sm bg-[#fff2cc]">
                <h4><b>Adelanto</b></h4>
                <b>Capital precancelado:</b> ${resultado.capitalReducido.toFixed(2)} UVA <br>
                <hr>
                <b>Costo por precancelación (3%):</b> ${resultado.costoPrecancelacion.toFixed(2)} UVA <br>
                <hr>
                <b>Total que debés pagar al banco:</b> <b>${resultado.totalAPagar.toFixed(2)} UVA</b> <br>
                <hr>
                <b>Interés restante sin prepago:</b> ${resultado.interesNormal.toFixed(2)} UVA <br>
                <hr>
                <b>Interés restante con prepago:</b> ${resultado.interesConPrepago.toFixed(2)} UVA <br>
                <hr>
                <b>Ahorro de intereses:</b> <b>${resultado.interesAhorrado.toFixed(2)} UVA</b> <br>
                <hr>
                <b>Cuotas eliminadas:</b> ${resultado.cuotasAhorradas}
            </div>
            <div class="p-1 m-1 border rounded-sm bg-[#b7e1cd]">
                <h4><b>Luego del adelanto</b></h4>
                <label><b>Saldo de capital (UVA):</b></label><br>
                <hr>
                <label><b>Saldo de capital (Pesos):</b></label><br>
                <hr>
                <label><b>Saldo de capital (Dólares):</b></label><br>
                <hr>
                <label><b>Saldo de interés (UVA):</b></label><br>
                <hr>
                <label><b>Saldo de interés (Pesos):</b></label><br>
                <hr>
                <label><b>Saldo de interés (Dólares):</b></label><br>
                <hr>
                <label><b>Saldo de cuotas (UVA):</b></label><br>
                <hr>
                <label><b>Saldo de cuotas (Pesos):</b></label><br>
                <hr>
                <label><b>Saldo de cuotas (Dólares):</b></label><br>
            </div>
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

const checkboxTotal = document.getElementById("cancelarTotal");
const inputPrepago = document.getElementById("prepago");

checkboxTotal.addEventListener("change", () => {

    const saldo = parseFloat(document.getElementById("saldo").value) || 0;

    if (checkboxTotal.checked) {
        inputPrepago.value = saldo;
        inputPrepago.disabled = true;
    } else {
        inputPrepago.disabled = false;
    }

});