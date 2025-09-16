package main

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// EVM message types for TAC chain
// These are simplified placeholder types that match the type URLs we found

// MsgEthereumTx represents the main Ethereum transaction wrapper
type MsgEthereumTx struct{}

// Implement sdk.Msg interface
func (msg MsgEthereumTx) Route() string { return "evm" }
func (msg MsgEthereumTx) Type() string  { return "ethereum_tx" }
func (msg MsgEthereumTx) ValidateBasic() error { return nil }
func (msg MsgEthereumTx) GetSignBytes() []byte { return []byte{} }
func (msg MsgEthereumTx) GetSigners() []sdk.AccAddress { return []sdk.AccAddress{} }
func (msg MsgEthereumTx) ProtoMessage() {}
func (msg MsgEthereumTx) Reset() {}
func (msg MsgEthereumTx) String() string { return "MsgEthereumTx" }

// DynamicFeeTx represents EIP-1559 dynamic fee transactions
type DynamicFeeTx struct{}

// Implement sdk.Msg interface
func (msg DynamicFeeTx) Route() string { return "evm" }
func (msg DynamicFeeTx) Type() string  { return "dynamic_fee_tx" }
func (msg DynamicFeeTx) ValidateBasic() error { return nil }
func (msg DynamicFeeTx) GetSignBytes() []byte { return []byte{} }
func (msg DynamicFeeTx) GetSigners() []sdk.AccAddress { return []sdk.AccAddress{} }
func (msg DynamicFeeTx) ProtoMessage() {}
func (msg DynamicFeeTx) Reset() {}
func (msg DynamicFeeTx) String() string { return "DynamicFeeTx" }

// LegacyTx represents legacy Ethereum transactions
type LegacyTx struct{}

// Implement sdk.Msg interface
func (msg LegacyTx) Route() string { return "evm" }
func (msg LegacyTx) Type() string  { return "legacy_tx" }
func (msg LegacyTx) ValidateBasic() error { return nil }
func (msg LegacyTx) GetSignBytes() []byte { return []byte{} }
func (msg LegacyTx) GetSigners() []sdk.AccAddress { return []sdk.AccAddress{} }
func (msg LegacyTx) ProtoMessage() {}
func (msg LegacyTx) Reset() {}
func (msg LegacyTx) String() string { return "LegacyTx" }

// GetTACEVMTypeMap returns the map of EVM message types for TAC chain
func GetTACEVMTypeMap() map[string]sdk.Msg {
	return map[string]sdk.Msg{
		"/cosmos.evm.vm.v1.MsgEthereumTx": &MsgEthereumTx{},
		"/cosmos.evm.vm.v1.DynamicFeeTx":  &DynamicFeeTx{},
		"/cosmos.evm.vm.v1.LegacyTx":      &LegacyTx{},
	}
}
