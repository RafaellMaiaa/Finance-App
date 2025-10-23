import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // 1. Importar a função diretamente
import { formatCurrency } from './currency.js';

export const generatePDFReport = (transactions, summary, startDate, endDate, user) => {
  try {
    const doc = new jsPDF();
    const preferredCurrency = user?.preferredCurrency || 'EUR';

    // --- CABEÇALHO ---
    doc.setFontSize(18);
    doc.text('Relatório Financeiro - Finance Flow', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    const formatDate = (date) => date ? new Date(date).toLocaleDateString('pt-PT') : 'Início';
    const period = startDate && endDate ? `${formatDate(startDate)} a ${formatDate(endDate)}` : 'Todo o Período';
    doc.text(`Período: ${period}`, 14, 30);

    // --- RESUMO ---
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Resumo:', 14, 45);
    const summaryData = [
      ['Ganhos:', formatCurrency(summary.income, preferredCurrency)],
      ['Gastos:', formatCurrency(summary.expenses, preferredCurrency)],
      ['Saldo:', formatCurrency(summary.balance, preferredCurrency)],
    ];

    // ✅ 2. CHAMAR autoTable PASSANDO O 'doc' ✅
    autoTable(doc, {
      startY: 50,
      head: [['Descrição', 'Valor']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [0, 194, 168] },
      margin: { left: 14, right: 14 },
      tableWidth: 'auto',
    });

    // --- TABELA DE TRANSAÇÕES ---
    // Pega na posição Y onde a tabela anterior terminou
    const summaryTableEndY = (doc).lastAutoTable.finalY || 50; 
    const transactionTableStartY = summaryTableEndY + 15;

    doc.text('Detalhe das Transações:', 14, transactionTableStartY - 5);
    const tableColumn = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
    const tableRows = (transactions || []).map(t => [
        new Date(t.date).toLocaleDateString('pt-PT'),
        t.description || '',
        t.category || '',
        t.type === 'ganho' ? 'Ganho' : 'Gasto',
        formatCurrency(t.amount, preferredCurrency),
    ]);

    if (tableRows.length > 0) {
        // ✅ 3. CHAMAR autoTable PASSANDO O 'doc' NOVAMENTE ✅
        autoTable(doc, {
            startY: transactionTableStartY,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [0, 194, 168] },
            margin: { left: 14, right: 14 },
        });
    } else {
        doc.text("Não há transações detalhadas para este período.", 14, transactionTableStartY + 10);
    }

    // --- RODAPÉ ---
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-PT')}`, 14, doc.internal.pageSize.height - 10);
    }

    // --- SALVAR O PDF ---
    const fileName = `Relatorio_Finance_Flow_${period.replace(/ /g, '_').replace(/\//g, '-')}.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    alert("Ocorreu um erro ao gerar o PDF. Verifique a consola.");
  }
};