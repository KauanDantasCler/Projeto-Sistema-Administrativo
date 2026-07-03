import React from 'react';
import { Card } from '@/components/ui/card';

export default function StatCard({ title, value, icon: Icon, color, subtitle }) {
    return (
        <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-6 translate-x-6 opacity-10 ${color}`} />
        <div className="flex items-start justify-between relative">
            <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-2 font-heading">{value}</p>
            {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
        </Card>
    );
}