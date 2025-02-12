import React, { useState } from 'react';
import { Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import _ from 'lodash';
import {Card, CardContent, CardHeader, CardTitle} from "./components/ui/card.jsx";
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const ClientList = ({ clients, selectedClient, onClientSelect, sortField, onSortChange, sortDirection }) => {
    const getSortIcon = (field) => {
        if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
        return sortDirection === 'asc' ?
            <ArrowUp className="w-4 h-4" /> :
            <ArrowDown className="w-4 h-4" />;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Client ID</th>
                    <th className="px-4 py-2 text-left cursor-pointer"
                        onClick={() => onSortChange('totalVolume')}>
                        <div className="flex items-center gap-2">
                            Volume {getSortIcon('totalVolume')}
                        </div>
                    </th>
                    <th className="px-4 py-2 text-left cursor-pointer"
                        onClick={() => onSortChange('avgConversion')}>
                        <div className="flex items-center gap-2">
                            Avg Conversion {getSortIcon('avgConversion')}
                        </div>
                    </th>
                    <th className="px-4 py-2 text-left">Months Active</th>
                </tr>
                </thead>
                <tbody>
                {clients.map((client) => (
                    <tr
                        key={client.fullId}
                        className={`hover:bg-gray-50 cursor-pointer ${
                            selectedClient?.fullId === client.fullId ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => onClientSelect(client)}
                    >
                        <td className="px-4 py-2">{client.fullId}</td>
                        <td className="px-4 py-2">{client.totalVolume.toLocaleString()}</td>
                        <td className="px-4 py-2">{client.avgConversion.toFixed(1)}%</td>
                        <td className="px-4 py-2">{client.monthsActive}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const ClientInsights = ({ client }) => {
    const trend = client.trend;
    const lastThreeMonths = trend.slice(-3);
    const avgLastThree = _.meanBy(lastThreeMonths, 'conversionRate');
    const avgAllTime = client.avgConversion;
    const improving = avgLastThree > avgAllTime;
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Performance Summary</h4>
                    <div className="space-y-2">
                        <p className="text-sm">Average Conversion: <span className="font-bold">{client.avgConversion.toFixed(1)}%</span></p>
                        <p className="text-sm">Total Volume: <span className="font-bold">{client.totalVolume.toLocaleString()}</span></p>
                        <p className="text-sm">Months Active: <span className="font-bold">{client.monthsActive}</span></p>
                    </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Trend Analysis</h4>
                    <div className="space-y-2">
                        <p className="text-sm">Recent Trend:
                            <span className={`font-bold ${improving ? 'text-green-600' : 'text-red-600'}`}>
                {improving ? ' Improving' : ' Declining'}
              </span>
                        </p>
                        <p className="text-sm">Best Month:
                            <span className="font-bold">
                {' ' + trend.reduce((max, month) =>
                    month.conversionRate > max.conversionRate ? month : max
                ).date}
              </span>
                        </p>
                        <p className="text-sm">Recent Avg:
                            <span className="font-bold">
                {' ' + avgLastThree.toFixed(1)}%
              </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={client.trend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="conversionRate"
                            stroke="#8884d8"
                            name="Conversion Rate (%)"
                        />
                        <Bar
                            yAxisId="right"
                            dataKey="volume"
                            fill="#82ca9d"
                            name="Volume"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div>
                <h4 className="font-semibold text-lg mb-4">Monthly Performance Details</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left">Month</th>
                            <th className="px-4 py-2 text-right">Volume</th>
                            <th className="px-4 py-2 text-right">Conversion Rate</th>
                            <th className="px-4 py-2 text-right">vs Avg</th>
                        </tr>
                        </thead>
                        <tbody>
                        {client.trend.map((month, idx) => (
                            <tr key={month.date} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-2">{month.date}</td>
                                <td className="px-4 py-2 text-right">{month.volume.toLocaleString()}</td>
                                <td className="px-4 py-2 text-right">{month.conversionRate.toFixed(1)}%</td>
                                <td className="px-4 py-2 text-right">
                    <span className={
                        month.conversionRate > client.avgConversion
                            ? 'text-green-600'
                            : 'text-red-600'
                    }>
                      {(month.conversionRate - client.avgConversion).toFixed(1)}%
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
const ConversionDashboard = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [inputData, setInputData] = useState('');
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [sortField, setSortField] = useState('totalVolume');
    const [sortDirection, setSortDirection] = useState('desc');
    const [monthlyTrends, setMonthlyTrends] = useState([]);
    const [topClients, setTopClients] = useState([]);
    const [error, setError] = useState('');


    const parseAndAnalyzeData = () => {
        try {
            const lines = inputData.trim().split('\n').filter(line => line.trim());

            const cleanData = lines.map(line => {
                const [date, clientId, volume, conversionRate] = line.split('\t');
                return {
                    date: date.trim(),
                    clientId: clientId.trim(),
                    volume: Number(String(volume).replace(',', '')),
                    conversionRate: parseFloat(String(conversionRate).replace('%', ''))
                };
            });

            const monthlyData = Object.entries(
                _.groupBy(cleanData, 'date')
            ).map(([date, entries]) => ({
                date,
                avgConversion: _.meanBy(entries, 'conversionRate'),
                totalVolume: _.sumBy(entries, 'volume'),
                activeClients: entries.length
            }));

            // Process client performance
            const clientPerformance = Object.entries(
                _.groupBy(cleanData, 'clientId')
            ).map(([clientId, entries]) => ({
                clientId: clientId.substring(0, 8),
                fullId: clientId,
                avgConversion: _.meanBy(entries, 'conversionRate'),
                totalVolume: _.sumBy(entries, 'volume'),
                monthsActive: entries.length,
                trend: entries.map(e => ({
                    date: e.date,
                    conversionRate: e.conversionRate,
                    volume: e.volume
                })).sort((a, b) => a.date.localeCompare(b.date))
            }));
            setMonthlyTrends(monthlyData);
            setTopClients(clientPerformance.slice(0, 5));
            setClients(clientPerformance);
            setSelectedClient(clientPerformance[0]);
            setError('');
        } catch (err) {
            setError('Error parsing data. Please ensure it\'s in the correct format: Date\\tClientID\\tVolume\\tConversionRate%');
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const sortedClients = _.orderBy(
        clients,
        [sortField],
        [sortDirection]
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded shadow">
                    <p className="font-bold">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value.toFixed(2)}
                            {entry.name.includes('Conversion') ? '%' : ''}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-4 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Data Input</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            {isExpanded ? 'Hide Input' : 'Show Input'}
                        </button>

                        {isExpanded && (
                            <div className="space-y-4">
                <textarea
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    placeholder="Paste your data here in format: Date[tab]ClientID[tab]Volume[tab]ConversionRate%"
                    className="w-full h-64 p-4 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                                <button
                                    onClick={parseAndAnalyzeData}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                >
                                    Analyze Data
                                </button>
                                {error && (
                                    <p className="text-red-500">{error}</p>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {monthlyTrends.length > 0 && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Monthly Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={monthlyTrends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="avgConversion"
                                            stroke="#8884d8"
                                            name="Avg Conversion Rate (%)"
                                        />
                                        <Bar
                                            yAxisId="right"
                                            dataKey="totalVolume"
                                            fill="#82ca9d"
                                            name="Total Volume"
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Card>
                            <CardHeader>
                                <CardTitle>Client List</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ClientList
                                    clients={sortedClients}
                                    selectedClient={selectedClient}
                                    onClientSelect={setSelectedClient}
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                    onSortChange={handleSort}
                                />
                            </CardContent>
                        </Card>
                        {selectedClient && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Client Performance  - {selectedClient.clientId}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="container">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <ComposedChart data={selectedClient.trend}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" />
                                                    <YAxis yAxisId="left" />
                                                    <YAxis yAxisId="right" orientation="right" />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Legend />
                                                    <Line
                                                        yAxisId="left"
                                                        type="monotone"
                                                        dataKey="conversionRate"
                                                        stroke="#8884d8"
                                                        name="Conversion Rate (%)"
                                                    />
                                                    <Bar
                                                        yAxisId="right"
                                                        dataKey="volume"
                                                        fill="#82ca9d"
                                                        name="Volume"
                                                    />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="container">
                                            <ClientInsights client={selectedClient}/>
                                        </div>
                                    </CardContent>
                                </Card>



                            </>
                        )}
                    </div>
                </>
            )}

        </div>
    );
};
export default ConversionDashboard;