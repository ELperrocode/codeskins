'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { IconReceipt } from '@tabler/icons-react';

interface OrderItem {
  templateId: {
    _id: string;
    title: string;
    price: number;
    category: string;
    previewImages?: string[];
  };
  title: string;
  price: number;
  quantity: number;
}

interface CustomerOrder {
  _id: string;
  items: OrderItem[];
  total: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  stripePaymentId?: string;
  customerEmail: string;
  createdAt: string;
}

interface ReceiptPDFProps {
  order: CustomerOrder;
  user: any;
}

export default function ReceiptPDF({ order, user }: ReceiptPDFProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generatePDF = async () => {
    if (!receiptRef.current) return;

    try {
      // Temporarily show the receipt content
      const receiptElement = receiptRef.current;
      receiptElement.style.display = 'block';
      receiptElement.style.position = 'absolute';
      receiptElement.style.left = '-9999px';
      receiptElement.style.top = '0';

      // Wait a bit for the content to render
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(receiptElement, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: 1200,
        scrollX: 0,
        scrollY: 0
      });

      // Hide the receipt content again
      receiptElement.style.display = 'none';

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`receipt-${order._id.slice(-8)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Hide the receipt content in case of error
      if (receiptRef.current) {
        receiptRef.current.style.display = 'none';
      }
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={generatePDF}
        className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
      >
        <IconReceipt className="w-4 h-4 mr-2" />
        Receipt
      </button>

      {/* Hidden receipt content for PDF generation */}
      <div ref={receiptRef} style={{ display: 'none', width: '800px', backgroundColor: 'white', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #ccc', paddingBottom: '30px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>CodeSkins</h1>
          <p style={{ color: '#666', margin: '5px 0' }}>Template Marketplace</p>
          <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>Receipt</p>
        </div>

        {/* Order Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Order Details</h3>
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>Order ID: {order._id.slice(-8).toUpperCase()}</p>
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>Date: {formatDate(order.createdAt)}</p>
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>Status: {order.status.toUpperCase()}</p>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Customer Info</h3>
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>Name: {user?.username}</p>
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>Email: {order.customerEmail}</p>
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>Payment: {order.paymentMethod}</p>
          </div>
        </div>

        {/* Items */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Items Purchased</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead style={{ backgroundColor: '#f5f5f5' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#333', borderBottom: '1px solid #ddd' }}>Template</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#333', borderBottom: '1px solid #ddd' }}>Category</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold', color: '#333', borderBottom: '1px solid #ddd' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold', color: '#333', borderBottom: '1px solid #ddd' }}>Qty</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold', color: '#333', borderBottom: '1px solid #ddd' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#333' }}>{item.title}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>{item.templateId?.category || 'Template'}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#333', textAlign: 'right' }}>{formatCurrency(item.price, order.currency)}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#333', textAlign: 'right' }}>{item.quantity}</td>
                  <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold', color: '#333', textAlign: 'right' }}>
                    {formatCurrency(item.price * item.quantity, order.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div style={{ borderTop: '2px solid #ccc', paddingTop: '30px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>Total</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{formatCurrency(order.total, order.currency)}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '30px', textAlign: 'center', fontSize: '14px', color: '#999' }}>
          <p style={{ margin: '5px 0' }}>Thank you for your purchase!</p>
          <p style={{ margin: '5px 0' }}>For support, contact us at support@codeskins.com</p>
          <p style={{ fontSize: '12px', marginTop: '20px' }}>
            This receipt was generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
} 