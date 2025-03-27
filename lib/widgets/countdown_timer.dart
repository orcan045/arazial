import 'dart:async';
import 'package:flutter/material.dart';

class CountdownTimer extends StatefulWidget {
  final int seconds;
  final TextStyle? style;
  final VoidCallback? onFinish;
  
  const CountdownTimer({
    super.key,
    required this.seconds,
    this.style,
    this.onFinish,
  });
  
  @override
  State<CountdownTimer> createState() => _CountdownTimerState();
}

class _CountdownTimerState extends State<CountdownTimer> {
  late Timer _timer;
  late int _remainingSeconds;
  
  @override
  void initState() {
    super.initState();
    _remainingSeconds = widget.seconds;
    
    if (_remainingSeconds > 0) {
      _startTimer();
    }
  }
  
  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) return;
      setState(() {
        if (_remainingSeconds > 0) {
          _remainingSeconds--;
        } else {
          _timer.cancel();
          if (widget.onFinish != null) {
            widget.onFinish!();
          }
        }
      });
    });
  }
  
  @override
  void dispose() {
    if (_remainingSeconds > 0) {
      _timer.cancel();
    }
    super.dispose();
  }

  String _formatRemainingTime(int seconds) {
    if (seconds <= 0) return 'Süre doldu';
    
    final days = seconds ~/ (24 * 3600);
    final hours = (seconds % (24 * 3600)) ~/ 3600;
    final minutes = (seconds % 3600) ~/ 60;
    final remainingSeconds = seconds % 60;
    
    if (days > 0) {
      return '${days}g ${hours}s';
    } else if (hours > 0) {
      return '${hours}s ${minutes}d';
    } else if (minutes > 0) {
      return '${minutes}:${remainingSeconds.toString().padLeft(2, '0')}';
    } else {
      return remainingSeconds.toString();
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Text(
      _formatRemainingTime(_remainingSeconds),
      style: widget.style ?? const TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.bold,
      ),
    );
  }
} 