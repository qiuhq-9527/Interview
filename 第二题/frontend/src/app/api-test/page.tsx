'use client';

import React, { useState } from 'react';

export default function ApiTestPage() {
  const [firstOperand, setFirstOperand] = useState<number>(1);
  const [secondOperand, setSecondOperand] = useState<number>(1);
  const [operation, setOperation] = useState<number>(1); // 1=加法
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  // 测试直接HTTP请求
  const testDirectApi = async () => {
    try {
      setStatus('发送请求中...');
      setError('');
      setResult('');

      // 构建请求对象
      const request = {
        firstOperand,
        secondOperand,
        operation,
      };

      console.log('请求参数:', request);

      // 发送API请求
      const response = await fetch('http://localhost:8080/calculator.v1.CalculatorService/Calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: request
        }),
      });

      // 获取响应
      const data = await response.json();
      console.log('API响应:', data);

      // 显示结果
      if (data.message && data.message.error) {
        setError(data.message.error);
      } else if (data.message) {
        setResult(String(data.message.result));
      } else {
        setError('收到无效响应');
      }

      setStatus(`完成 (状态码: ${response.status})`);
    } catch (err) {
      console.error('API调用失败:', err);
      setError(err instanceof Error ? err.message : '未知错误');
      setStatus('请求失败');
    }
  };

  // 测试后端连接
  const testConnection = async () => {
    try {
      setStatus('测试连接中...');
      const response = await fetch('http://localhost:8080', {
        method: 'GET',
      });
      setStatus(`连接测试完成 (状态码: ${response.status})`);
    } catch (err) {
      console.error('连接测试失败:', err);
      setStatus('连接测试失败');
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">计算器API测试</h1>
      
      <div className="mb-6">
        <button 
          onClick={testConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          测试后端连接
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block mb-1">第一个操作数:</label>
          <input
            type="number"
            value={firstOperand}
            onChange={(e) => setFirstOperand(Number(e.target.value))}
            className="border rounded p-2 w-full"
          />
        </div>
        
        <div>
          <label className="block mb-1">操作类型:</label>
          <select
            value={operation}
            onChange={(e) => setOperation(Number(e.target.value))}
            className="border rounded p-2 w-full"
          >
            <option value={1}>加法 (+)</option>
            <option value={2}>减法 (-)</option>
            <option value={3}>乘法 (×)</option>
            <option value={4}>除法 (÷)</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1">第二个操作数:</label>
          <input
            type="number"
            value={secondOperand}
            onChange={(e) => setSecondOperand(Number(e.target.value))}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <button
          onClick={testDirectApi}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          计算
        </button>
      </div>
      
      {status && (
        <div className="text-gray-600 mb-4">
          状态: {status}
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 p-4 rounded mb-4">
          <strong>计算结果:</strong> {result}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <strong>错误:</strong> {error}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h2 className="text-lg font-semibold mb-2">后端API说明</h2>
        <p className="mb-2">
          该API使用ConnectRPC协议，端点是: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:8080/calculator.v1.CalculatorService/Calculate</code>
        </p>
        <p className="mb-2">
          请求格式:
        </p>
        <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`{
  "message": {
    "firstOperand": 1,
    "secondOperand": 2,
    "operation": 1 // 1=加法,2=减法,3=乘法,4=除法
  }
}`}
        </pre>
      </div>
    </div>
  );
} 