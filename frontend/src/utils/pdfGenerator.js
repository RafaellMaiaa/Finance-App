import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './currency.js';

// Função auxiliar para adicionar rodapé
const addFooters = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Página ${i} de ${pageCount} | Gerado em: ${new Date().toLocaleDateString('pt-PT')}`,
      doc.internal.pageSize.width / 2, // Centralizado
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
};

export const generatePDFReport = (transactions, summary, startDate, endDate, user) => {
  try {
    const doc = new jsPDF();
    const preferredCurrency = user?.preferredCurrency || 'EUR';
    const primaryColor = '#00C2A8'; // Nossa cor primária (Fresh Mint)

    // --- TÍTULO ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(primaryColor); // Usar a cor primária
    doc.text('Relatório Financeiro', doc.internal.pageSize.width / 2, 22, { align: 'center' });
    doc.setFontSize(14);
    doc.setTextColor(0); // Voltar a preto
    doc.setFont('helvetica', 'normal');
    doc.text('Finance Flow', doc.internal.pageSize.width / 2, 30, { align: 'center' });

    // --- PERÍODO ---
    doc.setFontSize(10);
    doc.setTextColor(100);
    const formatDate = (date) => date ? new Date(date).toLocaleDateString('pt-PT') : 'Início';
    const period = startDate && endDate ? `${formatDate(startDate)} a ${formatDate(endDate)}` : 'Todo o Período';
    doc.text(`Período do Relatório: ${period}`, 14, 45);

    // --- TABELA DE RESUMO ---
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Resumo Financeiro', 14, 60);

    const summaryData = [
      ['Total de Ganhos:', formatCurrency(summary.income, preferredCurrency)],
      ['Total de Gastos:', formatCurrency(summary.expenses, preferredCurrency)],
      ['Saldo Final:', formatCurrency(summary.balance, preferredCurrency)],
    ];

    autoTable(doc, {
      startY: 65,
      body: summaryData,
      theme: 'plain', // Sem linhas, mais limpo
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold' }, // Primeira coluna a negrito
      },
      margin: { left: 14, right: 14 },
    });

    // --- TABELA DE TRANSAÇÕES DETALHADAS ---
    const transactionTableStartY = (doc).lastAutoTable.finalY + 15;
    doc.text('Detalhe das Transações', 14, transactionTableStartY - 5);

    const tableColumn = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
    const tableRows = (transactions || []).map(t => [
      new Date(t.date).toLocaleDateString('pt-PT'),
      t.description || '',
      t.category || '',
      t.type === 'ganho' ? 'Ganho' : 'Gasto',
      formatCurrency(t.amount, preferredCurrency),
    ]);

    if (tableRows.length > 0) {
      autoTable(doc, {
        startY: transactionTableStartY,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [0, 194, 168], textColor: 255 }, // Cabeçalho com cor primária
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => { // Adiciona o rodapé a cada página criada pela tabela
            addFooters(doc);
        }
      });
    } else {
      doc.text("Não há transações detalhadas para este período.", 14, transactionTableStartY + 10);
      addFooters(doc); // Adiciona rodapé mesmo se não houver tabela
    }

    // Adiciona o rodapé à última página se a tabela não o fez
    if(tableRows.length === 0 || doc.lastAutoTable.finalY < doc.internal.pageSize.height - 20) {
        addFooters(doc);
    }


    // --- SALVAR O PDF ---
    const fileName = `Relatorio_Finance_Flow_${period.replace(/ /g, '_').replace(/\//g, '-')}.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    alert("Ocorreu um erro ao gerar o PDF. Verifique a consola.");
  }
};