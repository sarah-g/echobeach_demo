#!/usr/bin/env python
import sys
import matplotlib
matplotlib.use('Agg')
from pylab import *
import wave

def show_wave_n_spec(filename):
    spf = wave.open(filename,'r')
    sound_info = spf.readframes(-1)
    sound_info = fromstring(sound_info, 'Int16')
    f = spf.getframerate()
    
    
    gs = GridSpec(2, 1, height_ratios=[3, 1]) 
    
    #subplot(211)
    subplot(gs[0])
    spectrogram = specgram(sound_info, Fs = f, scale_by_freq=True,sides='default')
    #title('Spectrogram and Wave Form')

    #subplot(212)
    subplot(gs[1])
    plot(sound_info)
    
    show()
    spf.close()

    savefig(filename[:-4] + '.png')

fil = sys.argv[1]

show_wave_n_spec(fil)