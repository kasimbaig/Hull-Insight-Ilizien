import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { ReportContainer, ReportHeader } from './ReportStyles';

const HvacReportHTML = ({ trial, onClose }) => {
  const reportRef = useRef(null);

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      // Temporarily enable scrolling for PDF capture
      const tableContainers = reportRef.current.querySelectorAll('.table-container');
      tableContainers.forEach(container => {
        container.style.overflowX = 'auto';
      });

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight,
      });

      // Restore original styling
      tableContainers.forEach(container => {
        container.style.overflowX = 'hidden';
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape mode
      
      const imgWidth = 297; // A4 landscape width
      const pageHeight = 210; // A4 landscape height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`HVAC_Trial_${trial.ship_name}_${trial.date_of_trials}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const downloadWord = async () => {
    if (!reportRef.current) return;

    try {
      // Create Word document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Title
            new Paragraph({
              children: [
                new TextRun({
                  text: "REPORT",
                  bold: true,
                  size: 48,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "HVAC PHASE I (HARBOUR PHASE)",
                  bold: true,
                  size: 36,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }), // Empty line

            // Ship Information
            new Paragraph({
              children: [
                new TextRun({
                  text: `Class of Ship - Kolkata`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Ship - ${trial.ship_name}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Date of conduct of trials - ${new Date(trial.date_of_trials).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                  })}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Place of conduct of trials - ${trial.place_of_trials}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Document No. ${trial.document_no}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Occasion for conduct of Trials - ${trial.occasion_of_trials}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Authority for conduct of Trials - ${trial.authority_for_trials}`,
                }),
              ],
            }),
            new Paragraph({ text: "" }), // Empty line

            // Table 1
            new Paragraph({
              children: [
                new TextRun({
                  text: "TABLE 1 - AIR FLOW MEASUREMENTS OF AC COMPARTMENTS",
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            new Paragraph({ text: "" }), // Empty line

            // Table 1 content
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: "Ser No." })],
                      width: { size: 8, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Served by ATU/ HE/ AHU/ FCU" })],
                      width: { size: 15, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Compartment Name" })],
                      width: { size: 12, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "No of Ducts" })],
                      width: { size: 8, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Duct Area (m²)" })],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Air Flow (m/s)" })],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Flow Rate at Duct (m³/hr)" })],
                      width: { size: 12, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Design Value" })],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Measured Value" })],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Observations" })],
                      width: { size: 15, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Remarks" })],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
                // Add rows for each measurement
                ...trial.airflow_measurements.map((measurement, index) => 
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: (index + 1).toString() })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.served_by })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.compartment_name_display })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.no_of_ducts.toString() })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.duct_area })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.air_flow })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.flow_rate_at_duct })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.design_air_flow_rate })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.measured_air_flow_rate })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.observations || '-' })],
                      }),
                      new TableCell({
                        children: [new Paragraph({
                          children: [new TextRun({
                            text: measurement.remarks || (measurement.observations === 'Sub-optimal air flow' ? 'UNSAT' : 'SAT'),
                            bold: measurement.remarks === 'UNSAT' || measurement.observations === 'Sub-optimal air flow'
                          })]
                        })],
                      }),
                    ],
                  })
                ),
              ],
            }),

            new Paragraph({ text: "" }), // Empty line

            // Table 2
            new Paragraph({
              children: [
                new TextRun({
                  text: "TABLE 2 - AIR FLOW MEASUREMENTS OF MACHINERY COMPARTMENTS/ GENERAL COMPARTMENTS",
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            new Paragraph({ text: "" }), // Empty line

            // Table 2 content
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: "Ser No" })],
                      width: { size: 8, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Served By Blower/ Fan Supply/ Fan Exhaust/ MCS/ MCE/ MCR/ MS/ ME" })],
                      width: { size: 15, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Compartment Name" })],
                      width: { size: 12, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "No of Ducts" })],
                      width: { size: 8, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Duct Area (m²)" })],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Air Flow (m/s)" })],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Flow Rate at Duct (m³/hr)" })],
                      width: { size: 12, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Design Value" })],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Measured Value" })],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Observations" })],
                      width: { size: 15, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Remarks" })],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
                // Add rows for each machinery measurement
                ...trial.machinery_airflow_measurements.map((measurement, index) => 
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: (index + 1).toString() })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.served_by })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.compartment_name_display })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.no_of_ducts.toString() })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.duct_area })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.air_flow })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.flow_rate_at_duct })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.design_air_flow_rate })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.measured_air_flow_rate })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: measurement.observations || 'Nil' })],
                      }),
                      new TableCell({
                        children: [new Paragraph({
                          children: [new TextRun({
                            text: measurement.remarks || (measurement.observations === 'Sub-optimal flow' ? 'UNSAT' : 'SAT'),
                            bold: measurement.remarks === 'UNSAT' || measurement.observations === 'Sub-optimal flow'
                          })]
                        })],
                      }),
                    ],
                  })
                ),
              ],
            }),
          ],
        }],
      });

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, `HVAC_Trial_${trial.ship_name}_${trial.date_of_trials}.docx`);
    } catch (error) {
      console.error('Error generating Word document:', error);
    }
  };

  // Group measurements by compartment for better display
  const groupedAirFlowMeasurements = trial.airflow_measurements.reduce((acc, measurement) => {
    const key = measurement.compartment_name_display;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(measurement);
    return acc;
  }, {});

  const groupedMachineryMeasurements = trial.machinery_airflow_measurements.reduce((acc, measurement) => {
    const key = measurement.served_by;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(measurement);
    return acc;
  }, {});

  return (
    <ReportContainer reportRef={reportRef}>
      <ReportHeader
        title="REPORT"
        subtitle="HVAC PHASE I (HARBOUR PHASE)"
        onDownloadPDF={downloadPDF}
        onDownloadWord={downloadWord}
        onClose={onClose}
      />

        {/* Report Content */}
        <div ref={reportRef} className="report-content">
          {/* Ship Information Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Class of Ship - Kolkata</p>
                <p className="font-semibold">Ship - {trial.ship_name}</p>
              </div>
              <div>
                <p className="font-semibold">Date of conduct of trials - {new Date(trial.date_of_trials).toLocaleDateString('en-GB', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                })}</p>
                <p className="font-semibold">Place of conduct of trials - {trial.place_of_trials}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p><span className="font-semibold">Document No.</span> {trial.document_no}</p>
              <p><span className="font-semibold">Occasion for conduct of Trials -</span> {trial.occasion_of_trials}</p>
              <p><span className="font-semibold">Authority for conduct of Trials -</span> {trial.authority_for_trials}</p>
            </div>
          </div>

          {/* Table 1 - AC Compartments */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">TABLE 1 - AIR FLOW MEASUREMENTS OF AC COMPARTMENTS</h3>
            
            <div className="w-full table-container">
              <table className="w-full text-xs" style={{ border: '1px solid #d1d5db' }}>
                <thead className="bg-gray-50">
                  <tr>
                  <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Ser No.</th>
                  <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Served by ATU/ HE/ AHU/ FCU</th>
                  <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Compartment Name</th>
                  <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>No of Ducts</th>
                  <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Duct Area (m²)</th>
                  <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Air Flow (m/s)</th>
                  <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Flow Rate at Duct (m³/hr)</th>
                  <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" colSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Total Air Flow Rate in Compartment (m³/hr)</th>
                  <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Observations</th>
                  <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2}>Remarks</th>
                  </tr>
                  <tr>
                    <th className="px-1 py-1 bg-gray-100 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>Design Value</th>
                    <th className="px-1 py-1 bg-gray-100 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>Measured Value</th>
                  </tr>
                  <tr>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}></th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>a.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>b.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>c.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>d.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>e.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>f.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>g.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>h.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>j.</th>
                    <th className="px-1 py-1 text-xs">k.</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(groupedAirFlowMeasurements).map(([compartment, measurements], compartmentIndex) => 
                    measurements.map((measurement, measurementIndex) => (
                      <tr key={`${compartment}-${measurementIndex}`} className={measurement.remarks === 'UNSAT' || measurement.observations === 'Sub-optimal air flow' ? 'bg-red-50' : ''}>
                        {measurementIndex === 0 && (
                          <>
                            <td className="px-1 py-1 align-top text-xs" rowSpan={measurements.length} style={{ borderRight: '1px solid #d1d5db' }}>{compartmentIndex + 1}.</td>
                            <td className="px-1 py-1 align-top text-xs" rowSpan={measurements.length} style={{ borderRight: '1px solid #d1d5db' }}>{measurement.served_by}</td>
                            <td className="px-1 py-1 align-top text-xs" rowSpan={measurements.length} style={{ borderRight: '1px solid #d1d5db' }}>{compartment}</td>
                            <td className="px-1 py-1 align-top text-xs" rowSpan={measurements.length} style={{ borderRight: '1px solid #d1d5db' }}>{measurement.no_of_ducts}</td>
                            <td className="px-1 py-1 align-top text-xs" rowSpan={measurements.length} style={{ borderRight: '1px solid #d1d5db' }}>{measurement.design_air_flow_rate}</td>
                            <td className="px-1 py-1 align-top text-xs" rowSpan={measurements.length} style={{ borderRight: '1px solid #d1d5db' }}>{measurement.measured_air_flow_rate}</td>
                            <td className="px-1 py-1 align-top text-xs" rowSpan={measurements.length} style={{ borderRight: '1px solid #d1d5db' }}>{measurement.observations || '-'}</td>
                            <td className="px-1 py-1 align-top font-semibold text-xs" rowSpan={measurements.length}>
                              <span className={measurement.remarks === 'UNSAT' || measurement.observations === 'Sub-optimal air flow' ? 'text-red-600' : 'text-green-600'}>
                                {measurement.remarks || (measurement.observations === 'Sub-optimal air flow' ? 'UNSAT' : 'SAT')}
                              </span>
                            </td>
                          </>
                        )}
                        <td className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>{measurement.duct_area}</td>
                        <td className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>{measurement.air_flow}</td>
                        <td className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>{measurement.flow_rate_at_duct}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2 - Machinery Compartments */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">TABLE 2 - AIR FLOW MEASUREMENTS OF MACHINERY COMPARTMENTS/ GENERAL COMPARTMENTS</h3>
            
            <div className="w-full table-container">
              <table className="w-full text-xs" style={{ border: '1px solid #d1d5db' }}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Ser No</th>
                    <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Served By Blower/ Fan Supply/ Fan Exhaust/ MCS/ MCE/ MCR/ MS/ ME</th>
                    <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Compartment Name</th>
                    <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>No of Ducts</th>
                    <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Duct Area (m²)</th>
                    <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Air Flow (m/s)</th>
                    <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Flow Rate at Duct (m³/hr)</th>
                    <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" colSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Total Air Flow Rate in Compartment (m³/hr)</th>
                    <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2} style={{ borderRight: '1px solid #d1d5db' }}>Observations</th>
                    <th className="px-1 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" rowSpan={2}>Remarks</th>
                  </tr>
                  <tr>
                    <th className="px-1 py-1 bg-gray-100 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>Design Value</th>
                    <th className="px-1 py-1 bg-gray-100 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>Measured Value</th>
                  </tr>
                  <tr>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}></th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>a.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>b.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>c.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>d.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>e.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>f.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>g.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>h.</th>
                    <th className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>j.</th>
                    <th className="px-1 py-1 text-xs">k.</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(groupedMachineryMeasurements).map(([servedBy, measurements], servedByIndex) => 
                    measurements.map((measurement, measurementIndex) => (
                      <tr key={`${servedBy}-${measurementIndex}`} className={measurement.remarks === 'UNSAT' || measurement.observations === 'Sub-optimal flow' ? 'bg-red-50' : ''}>
                        {measurementIndex === 0 && (
                          <>
                            <td className="px-1 py-1 text-xs align-top" rowSpan={measurements.length} style={{ borderRight: '1px solid #d1d5db' }}>{servedByIndex + 1}.</td>
                            <td className="px-1 py-1 text-xs align-top" rowSpan={measurements.length} style={{ borderRight: '1px solid #d1d5db' }}>{servedBy}</td>
                            <td className="px-1 py-1 text-xs align-top" rowSpan={measurements.length} style={{ borderRight: '1px solid #d1d5db' }}>{measurement.design_air_flow_rate}</td>
                            <td className="px-1 py-1 text-xs align-top" rowSpan={measurements.length} style={{ borderRight: '1px solid #d1d5db' }}>{measurement.measured_air_flow_rate}</td>
                            <td className="px-1 py-1 text-xs align-top" rowSpan={measurements.length} style={{ borderRight: '1px solid #d1d5db' }}>{measurement.observations || 'Nil'}</td>
                            <td className="px-1 py-1 align-top font-semibold text-xs" rowSpan={measurements.length}>
                              <span className={measurement.remarks === 'UNSAT' || measurement.observations === 'Sub-optimal flow' ? 'text-red-600' : 'text-green-600'}>
                                {measurement.remarks || (measurement.observations === 'Sub-optimal flow' ? 'UNSAT' : 'SAT')}
                              </span>
                            </td>
                          </>
                        )}
                        <td className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>{measurement.compartment_name_display}</td>
                        <td className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>{measurement.no_of_ducts}</td>
                        <td className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>{measurement.duct_area}</td>
                        <td className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>{measurement.air_flow}</td>
                        <td className="px-1 py-1 text-xs" style={{ borderRight: '1px solid #d1d5db' }}>{measurement.flow_rate_at_duct}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </ReportContainer>
  );
};

export default HvacReportHTML;
