import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLicenseData, editLicenseData, removeLicenseData, addProductData, toggleLicenseVisibility, toggleProductVisibility, editProductData, removeProductData } from '../../features/weekly/weeklySlice';
import { RootState } from '../../store/store';
import { MdClose, MdEdit } from 'react-icons/md';
import { SwitchInput } from './Inputs';

const LicenseForm: React.FC = () => {
    const dispatch = useDispatch();
    const licensesVisible = useSelector((state: RootState) => state.data.licensesVisible);
    const licenses = useSelector((state: RootState) => state.data.licenses);

    const [status, setStatus] = useState<string>('');
    const [product, setProduct] = useState<string>('');
    const [editIndex, setEditIndex] = useState<number | null>(null);


    const handleAddOrEditLicense = () => {
        if (status && product) {
            if (editIndex !== null) {
                dispatch(editLicenseData({ index: editIndex, Status: status, Product: product }));
                setEditIndex(null);
            } else {
                dispatch(addLicenseData({ Status: status, Product: product }));
            }
            setStatus('');
            setProduct('');
        }
    };

    const handleEdit = (index: number) => {
        setEditIndex(index);
        setStatus(licenses[index].Status);
        setProduct(licenses[index].Product);
    };

    const handleRemove = (index: number) => {
        dispatch(removeLicenseData(index));
    };

    const handleToggleFormVisibility = () => {
        dispatch(toggleLicenseVisibility());
    };

    return (
        <div className="p-6 bg-white rounded-lg border shadow-md">
            <h3 className="text-lg font-semibold mb-4">License Information Table</h3>
            <div className='mb-4'>
                <SwitchInput checked={licensesVisible} onChange={handleToggleFormVisibility}/>
            </div>
            
            <div className="mt-4">
                <h4 className="font-semibold">Table Data</h4>
                <ul>
                    {licenses.map((license: { Product: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; Status: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                        <li key={index} className="flex justify-between items-center mb-1">
                            <span className='text-sm font-medium'> Status: {license.Status} </span>
                            <span className='text-sm font-medium'>Product: {license.Product} </span>
                            <div className='flex space-x-2'>
                                <button onClick={() => handleEdit(index as number)} className="flex items-center justify-center p-2 bg-[#2f3848] text-white rounded-md mr-2"><MdEdit size={18} /></button>
                                <button onClick={() => handleRemove(index as number)} className="flex items-center justify-center p-2 bg-red-500 text-white rounded-md"> <MdClose size={18} /></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {licensesVisible && (
                <>
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <input
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                        <input
                            id="product"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        onClick={handleAddOrEditLicense}
                        className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
                    >
                        {editIndex !== null ? 'Update License' : 'Add License'}
                    </button>


                </>
            )}
        </div>
    );
};

const ProductForm: React.FC = () => {
    const dispatch = useDispatch();

    const [status, setStatus] = useState<string>('');
    const [product, setProduct] = useState<string>('');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const productVisible = useSelector((state: RootState) => state.data.productsVisible);
    const products = useSelector((state: RootState) => state.data.products);

    const handleAddOrEditProduct = () => {
        if (status && product) {
            if (editIndex !== null) {
                dispatch(editProductData({ index: editIndex, Status: status, Product: product }));
                setEditIndex(null);
            } else {
                dispatch(addProductData({ Status: status, Product: product }));
            }
            setStatus('');
            setProduct('');
        }
    };

    const handleEdit = (index: number) => {
        setEditIndex(index);
        setStatus(products[index].Status);
        setProduct(products[index].Product);
    };

    const handleRemove = (index: number) => {
        dispatch(removeProductData(index));
    };

    const handleToggleFormVisibility = () => {
        dispatch(toggleProductVisibility());
    };

    return (
        <div className="p-6 bg-white rounded-lg border shadow-md">
            <h3 className="text-lg font-semibold mb-4">Connected Product Table</h3>
            <div className='mb-4'>
                <SwitchInput checked={productVisible} onChange={handleToggleFormVisibility}/>
            </div>
            <div className="mt-4">
                <h4 className="font-semibold">Table Data</h4>
                <ul>
                    {products.map((product: { Product: string; Status: string; }, index: number) => (
                        <li key={index} className="flex justify-between items-center mb-1">
                            <span className='text-sm font-medium'>Status: {product.Status}</span>
                            <span className='text-sm font-medium'>Product: {product.Product}</span>
                            <div className='flex space-x-2'>
                                <button onClick={() => handleEdit(index)} className="flex items-center justify-center p-2 bg-[#2f3848] text-white rounded-md mr-2">
                                    <MdEdit size={18} />
                                </button>
                                <button onClick={() => handleRemove(index)} className="flex items-center justify-center p-2 bg-red-500 text-white rounded-md">
                                    <MdClose size={18} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {productVisible && (
                <>
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <input
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                        <input
                            id="product"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        onClick={handleAddOrEditProduct}
                        className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
                    >
                        {editIndex !== null ? 'Update Product' : 'Add Product'}
                    </button>
                </>
            )}
        </div>
    );
};

export { LicenseForm, ProductForm };
